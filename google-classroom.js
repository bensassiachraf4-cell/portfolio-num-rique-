/* StudyHub Google Classroom + Drive PDF import. No OAuth client secret is used. */
(() => {
  const CLIENT_ID = "942027975995-b8dr8nncmcbibk18cmvs3ddsp8jl8msv.apps.googleusercontent.com";
  const GOOGLE_CLOUD_PROJECT_NUMBER = "942027975995";
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
  const apiKeyInput = document.getElementById("googleApiKey");
  const pickBtn = document.getElementById("pickPdfBtn");
  const pdfStatus = document.getElementById("pdfImportStatus");
  const pdfPanel = document.getElementById("pdfExtractedPanel");
  const pdfName = document.getElementById("pdfExtractedName");
  const pdfText = document.getElementById("pdfExtractedText");
  if (!btn || !status || !results) return;
  let accessToken = null;
  let pickerReady = false;
  let pickerLoading = false;

  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle("is-error", error);
  };
  const setPdfStatus = (message, error = false) => {
    pdfStatus.textContent = message;
    pdfStatus.classList.toggle("is-error", error);
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
        if (!items.length) materialBox.innerHTML = '<p class="google-empty">Aucun support ou devoir accessible dans cette classe.</p>';
        else materialBox.innerHTML = items.map(item =>
          '<article class="google-resource"><div><strong>' + escapeHTML(item.title) + '</strong>' +
          (item.work ? '<span class="google-resource-tag">Devoir</span>' : '<span class="google-resource-tag">Support</span>') +
          (item.description ? '<p>' + escapeHTML(item.description) + '</p>' : '') +
          (item.date ? '<small>' + escapeHTML(item.date) + '</small>' : '') +
          '</div>' + (item.links.length ? '<div class="google-resource-links">' + item.links.map((url,n) => '<a href="' + escapeHTML(url) + '" target="_blank" rel="noopener">Ouvrir le fichier ' + (n+1) + ' ↗</a>').join("") + '</div>' : '') +
          '</article>'
        ).join("");
      } catch (error) {
        materialBox.innerHTML = '<p class="google-empty is-error">' + escapeHTML(error.message) + '</p>';
      }
    }
    setStatus("Synchronisation terminée. Les ressources restent dans ton Classroom/Drive d'origine.");
  };

  const loadPicker = () => {
    if (pickerReady || pickerLoading) return;
    pickerLoading = true;
    const wait = () => {
      if (window.gapi?.load) {
        window.gapi.load("picker", {callback:() => {
          pickerReady = true; pickerLoading = false;
          if (pickBtn) pickBtn.disabled = !accessToken;
        }});
      } else setTimeout(wait, 250);
    };
    wait();
  };
  const extractPdf = async file => {
    setPdfStatus("Téléchargement sécurisé du PDF depuis Drive…");
    const response = await fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(file.id) + "?alt=media", {
      headers:{Authorization:"Bearer " + accessToken}
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error?.message || "Impossible de lire ce fichier. Vérifie le partage et l'autorisation Drive.");
    }
    const bytes = await response.arrayBuffer();
    if (!window.pdfjsLib) throw new Error("Le lecteur PDF n'a pas chargé. Recharge la page.");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    setPdfStatus("Lecture du PDF et extraction du texte…");
    const pdf = await pdfjsLib.getDocument({data:bytes}).promise;
    let fullText = "";
    for (let pageNo=1; pageNo<=pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      const line = content.items.map(item => item.str).join(" ");
      fullText += "\n\n--- Page " + pageNo + " ---\n" + line;
    }
    if (!fullText.trim()) throw new Error("Aucun texte détecté. Ce PDF est peut-être un scan : il faudra une étape OCR.");
    pdfName.textContent = file.name + " · " + pdf.numPages + " page(s)";
    pdfText.value = fullText.trim();
    pdfPanel.hidden = false;
    window.studyHubImportedPdf = {id:file.id,name:file.name,mimeType:file.mimeType,pages:pdf.numPages,text:fullText.trim()};
    setPdfStatus("Import réussi : " + pdf.numPages + " page(s), " + fullText.trim().length + " caractères extraits. Le texte reste dans ton navigateur.");
  };
  const openPicker = () => {
    const key = apiKeyInput?.value.trim();
    if (!accessToken) { setPdfStatus("Connecte d'abord Google Classroom.", true); return; }
    if (!key) { setPdfStatus("Colle d'abord ta clé API Google dans le champ ci-dessus.", true); return; }
    if (!window.google?.picker || !pickerReady) { setPdfStatus("Le sélecteur Google Drive se charge. Réessaie dans quelques secondes."); loadPicker(); return; }
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
      .setMimeTypes("application/pdf")
      .setIncludeFolders(false);
    const picker = new google.picker.PickerBuilder()
      .setAppId(GOOGLE_CLOUD_PROJECT_NUMBER)
      .setDeveloperKey(key)
      .setOAuthToken(accessToken)
      .addView(view)
      .setTitle("Choisir un PDF de cours")
      .setCallback(async data => {
        if (data.action === google.picker.Action.PICKED && data.docs?.length) {
          try { await extractPdf(data.docs[0]); }
          catch (error) { setPdfStatus(error.message, true); }
        } else if (data.action === google.picker.Action.CANCEL) setPdfStatus("Importation annulée.");
      })
      .build();
    picker.setVisible(true);
  };

  const start = () => {
    if (!window.google?.accounts?.oauth2) {
      setStatus("Le service de connexion Google ne s'est pas chargé. Recharge la page et réessaie.", true);
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID, scope: SCOPES, include_granted_scopes: true,
      callback: async response => {
        if (response.error) { setStatus("Connexion refusée : " + response.error, true); return; }
        accessToken = response.access_token;
        btn.hidden = true; disconnectBtn.hidden = false;
        if (pickBtn) pickBtn.disabled = false;
        loadPicker();
        try { await loadClassroom(); }
        catch (error) { setStatus(error.message + " Vérifie que les API et les autorisations OAuth sont activées.", true); }
      }
    });
    tokenClient.requestAccessToken({prompt:""});
  };
  btn.addEventListener("click", start);
  pickBtn?.addEventListener("click", openPicker);
  disconnectBtn?.addEventListener("click", () => {
    if (accessToken && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(accessToken, () => {});
    accessToken = null; results.innerHTML = ""; pdfPanel.hidden = true; pdfText.value = "";
    btn.hidden = false; disconnectBtn.hidden = true;
    if (pickBtn) pickBtn.disabled = true;
    setStatus("Compte déconnecté de cette session.");
    setPdfStatus("");
  });
  if (apiKeyInput) apiKeyInput.addEventListener("input", () => {
    if (pickBtn) pickBtn.disabled = !accessToken || !apiKeyInput.value.trim();
  });
})();