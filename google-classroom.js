/* StudyHub Google Classroom connection.
   Uses Google Identity Services token flow: no client secret is stored in this public site. */
(() => {
  const CLIENT_ID = "942027975995-b8dr8nncmcbibk18cmvs3ddsp8jl8msv.apps.googleusercontent.com";
  const SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    "https://www.googleapis.com/auth/drive.file"
  ].join(" ");
  const btn = document.getElementById("googleConnectBtn");
  const disconnectBtn = document.getElementById("googleDisconnectBtn");
  const status = document.getElementById("googleConnectStatus");
  const results = document.getElementById("googleClassroomResults");
  if (!btn || !status || !results) return;
  let tokenClient = null;
  let accessToken = null;

  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle("is-error", error);
  };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
  const apiGet = async (url) => {
    const response = await fetch(url, {headers:{Authorization:"Bearer " + accessToken}});
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error?.message || ("Erreur Google API (" + response.status + ")"));
    }
    return response.json();
  };
  const linkForAttachment = attachment => {
    if (attachment.driveFile?.driveFile?.alternateLink) return attachment.driveFile.driveFile.alternateLink;
    if (attachment.link?.url) return attachment.link.url;
    if (attachment.youtubeVideo?.alternateLink) return attachment.youtubeVideo.alternateLink;
    if (attachment.form?.formUrl) return attachment.form.formUrl;
    return "";
  };
  const loadClassroom = async () => {
    setStatus("Connexion réussie. Chargement de tes classes…");
    results.innerHTML = "";
    const data = await apiGet("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=100");
    const courses = data.courses || [];
    if (!courses.length) {
      results.innerHTML = '<p class="google-empty">Aucune classe active trouvée sur ce compte Google.</p>';
      setStatus("Compte connecté, mais aucune classe active n'a été trouvée.");
      return;
    }
    setStatus(courses.length + " classe(s) trouvée(s). Chargement des supports…");
    for (const course of courses) {
      const card = document.createElement("section");
      card.className = "google-course-card";
      card.innerHTML = '<h3>' + escapeHTML(course.name) + '</h3>' +
        (course.section ? '<p class="google-course-section">' + escapeHTML(course.section) + '</p>' : '') +
        '<div class="google-course-materials">Chargement des ressources…</div>';
      results.appendChild(card);
      const materialBox = card.querySelector(".google-course-materials");
      try {
        const [materialsData, workData] = await Promise.all([
          apiGet("https://classroom.googleapis.com/v1/courses/" + encodeURIComponent(course.id) + "/courseWorkMaterials?pageSize=100"),
          apiGet("https://classroom.googleapis.com/v1/courses/" + encodeURIComponent(course.id) + "/courseWork?pageSize=100")
        ]);
        const items = [];
        for (const item of (materialsData.courseWorkMaterial || [])) {
          const attachments = (item.materials || []).map(linkForAttachment).filter(Boolean);
          items.push({title:item.title || "Support de cours", description:item.description || "", links:attachments, date:item.updateTime || item.creationTime || ""});
        }
        for (const item of (workData.courseWork || [])) {
          const attachments = (item.materials || []).map(linkForAttachment).filter(Boolean);
          items.push({title:item.title || "Devoir", description:item.description || "", links:attachments, date:item.dueDate ? [item.dueDate.year,item.dueDate.month,item.dueDate.day].join("-") : "", work:true});
        }
        if (!items.length) {
          materialBox.innerHTML = '<p class="google-empty">Aucun support ou devoir accessible dans cette classe.</p>';
        } else {
          materialBox.innerHTML = items.map(item =>
            '<article class="google-resource"><div><strong>' + escapeHTML(item.title) + '</strong>' +
            (item.work ? '<span class="google-resource-tag">Devoir</span>' : '<span class="google-resource-tag">Support</span>') +
            (item.description ? '<p>' + escapeHTML(item.description) + '</p>' : '') +
            (item.date ? '<small>' + escapeHTML(item.date) + '</small>' : '') +
            '</div>' + (item.links.length ? '<div class="google-resource-links">' + item.links.map((url,i) => '<a href="' + escapeHTML(url) + '" target="_blank" rel="noopener">Ouvrir le fichier ' + (i+1) + ' ↗</a>').join("") + '</div>' : '') +
            '</article>'
          ).join("");
        }
      } catch (error) {
        materialBox.innerHTML = '<p class="google-empty is-error">' + escapeHTML(error.message) + '</p>';
      }
    }
    setStatus("Synchronisation terminée. Les ressources restent dans ton Classroom/Drive d'origine.");
  };

  const start = () => {
    if (!window.google?.accounts?.oauth2) {
      setStatus("Le service de connexion Google ne s'est pas chargé. Recharge la page et réessaie.", true);
      return;
    }
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      include_granted_scopes: true,
      callback: async response => {
        if (response.error) {
          setStatus("Connexion refusée : " + response.error, true);
          return;
        }
        accessToken = response.access_token;
        btn.hidden = true;
        disconnectBtn.hidden = false;
        try { await loadClassroom(); }
        catch (error) {
          setStatus(error.message + " Vérifie que les API et les autorisations OAuth sont activées.", true);
        }
      }
    });
    tokenClient.requestAccessToken({prompt:"consent"});
  };
  btn.addEventListener("click", start);
  disconnectBtn?.addEventListener("click", () => {
    if (accessToken && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(accessToken, () => {});
    accessToken = null;
    results.innerHTML = "";
    btn.hidden = false;
    disconnectBtn.hidden = true;
    setStatus("Compte déconnecté de cette session.");
  });
})();
