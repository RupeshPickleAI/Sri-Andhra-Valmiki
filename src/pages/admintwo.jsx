// src/pages/admintwo.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * AdminTwo: Content CRUD + PDF Manager
 * Articles → Chapters → Topics → Content Blocks + PDF Attachments
 */
const AdminTwo = ({
  apiFetch,
  normalizeArrayResponse,
  normalizeItemResponse,
  getId,
  CONTENT_API_BASE_URL,
  PDF_API_URL,
}) => {
  // Content manager
  const [articles, setArticles] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [contents, setContents] = useState([]);

  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const [articleForm, setArticleForm] = useState({
    id: null,
    title: "",
    description: "",
    label: "",
  });

  const [chapterForm, setChapterForm] = useState({
    id: null,
    title: "",
    summary: "",
    label: "",
    order: "",
  });

  const [topicForm, setTopicForm] = useState({
    id: null,
    title: "",
    description: "",
    label: "",
    order: "",
  });

  const [contentForm, setContentForm] = useState({
    id: null,
    heading: "",
    body: "",
    label: "",
    order: "",
  });

  const [articleMessageAdmin, setArticleMessageAdmin] = useState("");
  const [chapterMessageAdmin, setChapterMessageAdmin] = useState("");
  const [topicMessageAdmin, setTopicMessageAdmin] = useState("");
  const [contentMessageAdmin, setContentMessageAdmin] = useState("");

  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingContents, setLoadingContents] = useState(false);

  // ------------------------------
  // PDF Manager
  // ------------------------------
  const pdfFileInputRef = useRef(null);
  const [pdfList, setPdfList] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");

  const currentPdfAutoTarget = useMemo(() => {
    if (contentForm?.id) return { parentType: "content", parentId: contentForm.id };
    if (selectedTopicId) return { parentType: "topic", parentId: selectedTopicId };
    if (selectedChapterId) return { parentType: "chapter", parentId: selectedChapterId };
    if (selectedArticleId) return { parentType: "article", parentId: selectedArticleId };
    return { parentType: "", parentId: "" };
  }, [contentForm?.id, selectedTopicId, selectedChapterId, selectedArticleId]);

  const [pdfParentType, setPdfParentType] = useState("");
  const [pdfParentId, setPdfParentId] = useState("");

  useEffect(() => {
    if (currentPdfAutoTarget.parentType && currentPdfAutoTarget.parentId) {
      setPdfParentType(currentPdfAutoTarget.parentType);
      setPdfParentId(currentPdfAutoTarget.parentId);
    } else {
      setPdfParentType("");
      setPdfParentId("");
      setPdfList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPdfAutoTarget.parentType, currentPdfAutoTarget.parentId]);

  const pdfParentOptions = useMemo(() => {
    const opts = [];
    if (selectedArticleId) opts.push({ value: "article", label: "Article", id: selectedArticleId });
    if (selectedChapterId) opts.push({ value: "chapter", label: "Chapter", id: selectedChapterId });
    if (selectedTopicId) opts.push({ value: "topic", label: "Topic", id: selectedTopicId });
    if (contentForm?.id) opts.push({ value: "content", label: "Content", id: contentForm.id });
    return opts;
  }, [selectedArticleId, selectedChapterId, selectedTopicId, contentForm?.id]);

  const fetchPdfs = async (parentType, parentId) => {
    if (!parentType || !parentId) {
      setPdfList([]);
      return;
    }
    setPdfLoading(true);
    setPdfMessage("");
    try {
      const json = await apiFetch(
        `${PDF_API_URL}?parentType=${encodeURIComponent(parentType)}&parentId=${encodeURIComponent(
          parentId
        )}`
      );
      setPdfList(normalizeArrayResponse(json));
    } catch (err) {
      console.error("fetch pdfs error:", err);
      setPdfMessage(err.message || "Failed to load PDFs");
      setPdfList([]);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    if (pdfParentType && pdfParentId) fetchPdfs(pdfParentType, pdfParentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfParentType, pdfParentId]);

  const handlePickPdfTarget = (newType) => {
    const found = pdfParentOptions.find((o) => o.value === newType);
    if (!found) return;
    setPdfParentType(found.value);
    setPdfParentId(found.id);
  };

  const handlePdfUploadClick = () => {
    if (!pdfParentType || !pdfParentId) {
      setPdfMessage("Select an Article/Chapter/Topic/Content first to attach PDF.");
      setTimeout(() => setPdfMessage(""), 3000);
      return;
    }
    pdfFileInputRef.current?.click();
  };

  const handlePdfFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !(file.name || "").toLowerCase().endsWith(".pdf")) {
      setPdfMessage("Please select a valid PDF file.");
      setTimeout(() => setPdfMessage(""), 3000);
      e.target.value = "";
      return;
    }

    if (!pdfParentType || !pdfParentId) {
      setPdfMessage("Select a parent first.");
      setTimeout(() => setPdfMessage(""), 3000);
      e.target.value = "";
      return;
    }

    setPdfUploading(true);
    setPdfMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("parentType", pdfParentType);
      formData.append("parentId", pdfParentId);
      if (pdfTitle.trim()) formData.append("title", pdfTitle.trim());

      await apiFetch(PDF_API_URL, { method: "POST", body: formData });

      setPdfTitle("");
      setPdfMessage("PDF uploaded successfully ✨");
      await fetchPdfs(pdfParentType, pdfParentId);
    } catch (err) {
      console.error("pdf upload error:", err);
      setPdfMessage(err.message || "PDF upload failed");
    } finally {
      setPdfUploading(false);
      if (e.target) e.target.value = "";
      setTimeout(() => setPdfMessage(""), 4000);
    }
  };

  const handleRenamePdf = async (pdfItem) => {
    const id = getId(pdfItem);
    if (!id) return;

    const newTitle = window.prompt(
      "Enter a display title for this PDF:",
      pdfItem.title || pdfItem.originalName || "Document"
    );
    if (newTitle == null) return;

    try {
      setPdfMessage("");
      const form = new FormData();
      form.append("title", newTitle);

      await apiFetch(`${PDF_API_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: form,
      });

      setPdfMessage("PDF title updated ✨");
      await fetchPdfs(pdfParentType, pdfParentId);
    } catch (err) {
      console.error("rename pdf error:", err);
      setPdfMessage(err.message || "Failed to rename PDF");
    } finally {
      setTimeout(() => setPdfMessage(""), 4000);
    }
  };

  const handleDeletePdf = async (pdfItem) => {
    const id = getId(pdfItem);
    if (!id) return;

    const ok = window.confirm("Delete this PDF? This will remove the file too.");
    if (!ok) return;

    try {
      setPdfMessage("");
      await apiFetch(`${PDF_API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
      setPdfMessage("PDF deleted.");
      await fetchPdfs(pdfParentType, pdfParentId);
    } catch (err) {
      console.error("delete pdf error:", err);
      setPdfMessage(err.message || "Failed to delete PDF");
    } finally {
      setTimeout(() => setPdfMessage(""), 4000);
    }
  };

  // ---------------------------------------------------------------------------
  // CONTENT CRUD
  // ---------------------------------------------------------------------------
  const fetchArticlesAdmin = async () => {
    setLoadingArticles(true);
    setArticleMessageAdmin("");
    try {
      const json = await apiFetch(`${CONTENT_API_BASE_URL}/articles`);
      setArticles(normalizeArrayResponse(json));
    } catch (err) {
      console.error(err);
      setArticleMessageAdmin(err.message || "Failed to load articles from API.");
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchChaptersAdmin = async (articleId) => {
    if (!articleId) return;
    setLoadingChapters(true);
    setChapterMessageAdmin("");
    try {
      const json = await apiFetch(
        `${CONTENT_API_BASE_URL}/chapters?articleId=${encodeURIComponent(articleId)}`
      );
      setChapters(normalizeArrayResponse(json));
    } catch (err) {
      console.error(err);
      setChapterMessageAdmin(err.message || "Failed to load chapters from API.");
    } finally {
      setLoadingChapters(false);
    }
  };

  const fetchTopicsAdmin = async (chapterId) => {
    if (!chapterId) return;
    setLoadingTopics(true);
    setTopicMessageAdmin("");
    try {
      const json = await apiFetch(
        `${CONTENT_API_BASE_URL}/topics?chapterId=${encodeURIComponent(chapterId)}`
      );
      setTopics(normalizeArrayResponse(json));
    } catch (err) {
      console.error(err);
      setTopicMessageAdmin(err.message || "Failed to load topics from API.");
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchContentsAdmin = async (topicId) => {
    if (!topicId) return;
    setLoadingContents(true);
    setContentMessageAdmin("");
    try {
      const json = await apiFetch(
        `${CONTENT_API_BASE_URL}/contents?topicId=${encodeURIComponent(topicId)}`
      );
      setContents(normalizeArrayResponse(json));
    } catch (err) {
      console.error(err);
      setContentMessageAdmin(err.message || "Failed to load contents from API.");
    } finally {
      setLoadingContents(false);
    }
  };

  useEffect(() => {
    fetchArticlesAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Selection handlers ----
  const handleSelectArticle = (article) => {
    const id = getId(article);
    setSelectedArticleId(id);
    setSelectedChapterId(null);
    setSelectedTopicId(null);

    setChapterForm({ id: null, title: "", summary: "", label: "", order: "" });
    setTopicForm({ id: null, title: "", description: "", label: "", order: "" });
    setContentForm({ id: null, heading: "", body: "", label: "", order: "" });

    setChapters([]);
    setTopics([]);
    setContents([]);

    setArticleForm({
      id,
      title: article.title || "",
      description: article.description || article.summary || "",
      label: article.label || "",
    });

    fetchChaptersAdmin(id);
  };

  const handleSelectChapter = (chapter) => {
    const id = getId(chapter);
    setSelectedChapterId(id);
    setSelectedTopicId(null);

    setTopicForm({ id: null, title: "", description: "", label: "", order: "" });
    setContentForm({ id: null, heading: "", body: "", label: "", order: "" });

    setTopics([]);
    setContents([]);

    setChapterForm({
      id,
      title: chapter.title || "",
      summary: chapter.summary || chapter.description || "",
      label: chapter.label || "",
      order: chapter.order !== undefined && chapter.order !== null ? String(chapter.order) : "",
    });

    fetchTopicsAdmin(id);
  };

  const handleSelectTopic = (topic) => {
    const id = getId(topic);
    setSelectedTopicId(id);

    setContentForm({ id: null, heading: "", body: "", label: "", order: "" });
    setContents([]);

    setTopicForm({
      id,
      title: topic.title || "",
      description: topic.description || "",
      label: topic.label || "",
      order: topic.order !== undefined && topic.order !== null ? String(topic.order) : "",
    });

    fetchContentsAdmin(id);
  };

  const handleSelectContent = (content) => {
    const id = getId(content);
    setContentForm({
      id,
      heading: content.heading || "",
      body: content.body || "",
      label: content.label || "",
      order: content.order !== undefined && content.order !== null ? String(content.order) : "",
    });
  };

  // ---- Input change handlers ----
  const handleArticleInputChange = (field, value) => setArticleForm((p) => ({ ...p, [field]: value }));
  const handleChapterInputChange = (field, value) => setChapterForm((p) => ({ ...p, [field]: value }));
  const handleTopicInputChange = (field, value) => setTopicForm((p) => ({ ...p, [field]: value }));
  const handleContentInputChange = (field, value) => setContentForm((p) => ({ ...p, [field]: value }));

  // ---- Create/Update/Delete Article ----
  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    const title = articleForm.title.trim();
    if (!title) {
      setArticleMessageAdmin("Title is required for article.");
      setTimeout(() => setArticleMessageAdmin(""), 3000);
      return;
    }

    const payload = { title };
    if (articleForm.description.trim()) payload.description = articleForm.description.trim();
    if (articleForm.label.trim()) payload.label = articleForm.label.trim();

    try {
      setLoadingArticles(true);
      setArticleMessageAdmin("");

      if (articleForm.id) {
        await apiFetch(`${CONTENT_API_BASE_URL}/articles/${encodeURIComponent(articleForm.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setArticleMessageAdmin("Article updated successfully ✨");
      } else {
        const json = await apiFetch(`${CONTENT_API_BASE_URL}/articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = normalizeItemResponse(json);
        setArticleMessageAdmin("Article created successfully ✨");

        if (created) {
          const id = getId(created);
          setSelectedArticleId(id);
          setArticleForm({
            id,
            title: created.title || title,
            description: created.description || payload.description || "",
            label: created.label || payload.label || "",
          });
        }
      }

      await fetchArticlesAdmin();
    } catch (err) {
      console.error("Save article error:", err);
      setArticleMessageAdmin(err.message || "Error saving article. Please try again.");
    } finally {
      setLoadingArticles(false);
      setTimeout(() => setArticleMessageAdmin(""), 4000);
    }
  };

  const handleDeleteArticle = async () => {
    if (!articleForm.id) return;
    const confirmed = window.confirm("Delete this article and all its children?");
    if (!confirmed) return;

    try {
      setLoadingArticles(true);
      await apiFetch(`${CONTENT_API_BASE_URL}/articles/${encodeURIComponent(articleForm.id)}`, {
        method: "DELETE",
      });

      setArticleMessageAdmin("Article deleted successfully.");
      setArticleForm({ id: null, title: "", description: "", label: "" });

      setSelectedArticleId(null);
      setSelectedChapterId(null);
      setSelectedTopicId(null);
      setChapters([]);
      setTopics([]);
      setContents([]);

      await fetchArticlesAdmin();
    } catch (err) {
      console.error("Delete article error:", err);
      setArticleMessageAdmin(err.message || "Error deleting article.");
    } finally {
      setLoadingArticles(false);
      setTimeout(() => setArticleMessageAdmin(""), 4000);
    }
  };

  // ---- Chapter ----
  const handleSubmitChapter = async (e) => {
    e.preventDefault();
    if (!selectedArticleId) {
      setChapterMessageAdmin("Select an article first.");
      setTimeout(() => setChapterMessageAdmin(""), 3000);
      return;
    }

    const title = chapterForm.title.trim();
    if (!title) {
      setChapterMessageAdmin("Title is required for chapter.");
      setTimeout(() => setChapterMessageAdmin(""), 3000);
      return;
    }

    const payload = { articleId: selectedArticleId, title };
    if (chapterForm.summary.trim()) payload.summary = chapterForm.summary.trim();
    if (chapterForm.label.trim()) payload.label = chapterForm.label.trim();
    if (chapterForm.order.trim()) {
      const num = Number(chapterForm.order);
      if (!Number.isNaN(num)) payload.order = num;
    }

    try {
      setLoadingChapters(true);
      setChapterMessageAdmin("");

      if (chapterForm.id) {
        await apiFetch(`${CONTENT_API_BASE_URL}/chapters/${encodeURIComponent(chapterForm.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setChapterMessageAdmin("Chapter updated successfully ✨");
      } else {
        const json = await apiFetch(`${CONTENT_API_BASE_URL}/chapters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = normalizeItemResponse(json);
        setChapterMessageAdmin("Chapter created successfully ✨");

        if (created) {
          const id = getId(created);
          setSelectedChapterId(id);
          setChapterForm({
            id,
            title: created.title || title,
            summary: created.summary || payload.summary || "",
            label: created.label || payload.label || "",
            order:
              created.order !== undefined && created.order !== null
                ? String(created.order)
                : chapterForm.order,
          });
        }
      }

      await fetchChaptersAdmin(selectedArticleId);
    } catch (err) {
      console.error("Save chapter error:", err);
      setChapterMessageAdmin(err.message || "Error saving chapter. Please try again.");
    } finally {
      setLoadingChapters(false);
      setTimeout(() => setChapterMessageAdmin(""), 4000);
    }
  };

  const handleDeleteChapter = async () => {
    if (!chapterForm.id) return;
    const confirmed = window.confirm("Delete this chapter and its children?");
    if (!confirmed) return;

    try {
      setLoadingChapters(true);
      await apiFetch(`${CONTENT_API_BASE_URL}/chapters/${encodeURIComponent(chapterForm.id)}`, {
        method: "DELETE",
      });

      setChapterMessageAdmin("Chapter deleted successfully.");
      setChapterForm({ id: null, title: "", summary: "", label: "", order: "" });

      setSelectedChapterId(null);
      setSelectedTopicId(null);
      setTopics([]);
      setContents([]);

      await fetchChaptersAdmin(selectedArticleId);
    } catch (err) {
      console.error("Delete chapter error:", err);
      setChapterMessageAdmin(err.message || "Error deleting chapter.");
    } finally {
      setLoadingChapters(false);
      setTimeout(() => setChapterMessageAdmin(""), 4000);
    }
  };

  // ---- Topic ----
  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    if (!selectedChapterId) {
      setTopicMessageAdmin("Select a chapter first.");
      setTimeout(() => setTopicMessageAdmin(""), 3000);
      return;
    }

    const title = topicForm.title.trim();
    if (!title) {
      setTopicMessageAdmin("Title is required for topic.");
      setTimeout(() => setTopicMessageAdmin(""), 3000);
      return;
    }

    const payload = { chapterId: selectedChapterId, title };
    if (topicForm.description.trim()) payload.description = topicForm.description.trim();
    if (topicForm.label.trim()) payload.label = topicForm.label.trim();
    if (topicForm.order.trim()) {
      const num = Number(topicForm.order);
      if (!Number.isNaN(num)) payload.order = num;
    }

    try {
      setLoadingTopics(true);
      setTopicMessageAdmin("");

      if (topicForm.id) {
        await apiFetch(`${CONTENT_API_BASE_URL}/topics/${encodeURIComponent(topicForm.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setTopicMessageAdmin("Topic updated successfully ✨");
      } else {
        const json = await apiFetch(`${CONTENT_API_BASE_URL}/topics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = normalizeItemResponse(json);
        setTopicMessageAdmin("Topic created successfully ✨");

        if (created) {
          const id = getId(created);
          setSelectedTopicId(id);
          setTopicForm({
            id,
            title: created.title || title,
            description: created.description || payload.description || "",
            label: created.label || payload.label || "",
            order:
              created.order !== undefined && created.order !== null
                ? String(created.order)
                : topicForm.order,
          });
        }
      }

      await fetchTopicsAdmin(selectedChapterId);
    } catch (err) {
      console.error("Save topic error:", err);
      setTopicMessageAdmin(err.message || "Error saving topic. Please try again.");
    } finally {
      setLoadingTopics(false);
      setTimeout(() => setTopicMessageAdmin(""), 4000);
    }
  };

  const handleDeleteTopic = async () => {
    if (!topicForm.id) return;
    const confirmed = window.confirm("Delete this topic and its contents?");
    if (!confirmed) return;

    try {
      setLoadingTopics(true);
      await apiFetch(`${CONTENT_API_BASE_URL}/topics/${encodeURIComponent(topicForm.id)}`, {
        method: "DELETE",
      });

      setTopicMessageAdmin("Topic deleted successfully.");
      setTopicForm({ id: null, title: "", description: "", label: "", order: "" });

      setSelectedTopicId(null);
      setContents([]);

      await fetchTopicsAdmin(selectedChapterId);
    } catch (err) {
      console.error("Delete topic error:", err);
      setTopicMessageAdmin(err.message || "Error deleting topic.");
    } finally {
      setLoadingTopics(false);
      setTimeout(() => setTopicMessageAdmin(""), 4000);
    }
  };

  // ---- Content ----
  const handleSubmitContent = async (e) => {
    e.preventDefault();
    if (!selectedTopicId) {
      setContentMessageAdmin("Select a topic first.");
      setTimeout(() => setContentMessageAdmin(""), 3000);
      return;
    }

    const body = contentForm.body.trim();
    if (!body) {
      setContentMessageAdmin("Body is required for content.");
      setTimeout(() => setContentMessageAdmin(""), 3000);
      return;
    }

    const payload = { topicId: selectedTopicId, body };
    if (contentForm.heading.trim()) payload.heading = contentForm.heading.trim();
    if (contentForm.label.trim()) payload.label = contentForm.label.trim();
    if (contentForm.order.trim()) {
      const num = Number(contentForm.order);
      if (!Number.isNaN(num)) payload.order = num;
    }

    try {
      setLoadingContents(true);
      setContentMessageAdmin("");

      if (contentForm.id) {
        await apiFetch(`${CONTENT_API_BASE_URL}/contents/${encodeURIComponent(contentForm.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setContentMessageAdmin("Content updated successfully ✨");
      } else {
        const json = await apiFetch(`${CONTENT_API_BASE_URL}/contents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = normalizeItemResponse(json);
        setContentMessageAdmin("Content created successfully ✨");

        if (created) {
          const id = getId(created);
          setContentForm({
            id,
            heading: created.heading || payload.heading || "",
            body: created.body || body,
            label: created.label || payload.label || "",
            order:
              created.order !== undefined && created.order !== null
                ? String(created.order)
                : contentForm.order,
          });
        }
      }

      await fetchContentsAdmin(selectedTopicId);
    } catch (err) {
      console.error("Save content error:", err);
      setContentMessageAdmin(err.message || "Error saving content. Please try again.");
    } finally {
      setLoadingContents(false);
      setTimeout(() => setContentMessageAdmin(""), 4000);
    }
  };

  const handleDeleteContent = async () => {
    if (!contentForm.id) return;
    const confirmed = window.confirm("Delete this content block?");
    if (!confirmed) return;

    try {
      setLoadingContents(true);
      await apiFetch(`${CONTENT_API_BASE_URL}/contents/${encodeURIComponent(contentForm.id)}`, {
        method: "DELETE",
      });

      setContentMessageAdmin("Content deleted successfully.");
      setContentForm({ id: null, heading: "", body: "", label: "", order: "" });

      await fetchContentsAdmin(selectedTopicId);
    } catch (err) {
      console.error("Delete content error:", err);
      setContentMessageAdmin(err.message || "Error deleting content.");
    } finally {
      setLoadingContents(false);
      setTimeout(() => setContentMessageAdmin(""), 4000);
    }
  };

  // ---------------------------------------------------------------------------
  // UI (Responsive)
  // ---------------------------------------------------------------------------
  return (
    <motion.section
      className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.16 }}
      viewport={{ once: true }}
    >
      {/* mobile polish via media query */}
      <style>{`
        @media (max-width: 640px) {
          .admin-two-grid { gap: 0.75rem !important; }
          .admin-two-card { padding: 0.75rem !important; }
          .admin-two-card h3 { font-size: 0.9rem !important; }
        }
      `}</style>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-orange-700">
            Articles &amp; Scriptures Manager
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Articles → Chapters → Topics → Content Blocks (with PDF attachments)
          </p>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 lg:text-right">
          <div>All operations use:</div>
          <div className="font-mono break-all">
            /api/content/articles, /api/content/chapters, /api/content/topics, /api/content/contents, /api/content/pdfs
          </div>
        </div>
      </div>

      {/* PDF Manager */}
      <div className="mb-6 bg-orange-50/60 border border-orange-100 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-800">📄 PDF Attachments</h3>
            <p className="text-xs text-gray-600 mt-1">
              Attach PDFs to Article / Chapter / Topic / Content. Users can view & download.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-2 sm:gap-3">
            <div className="min-w-[160px]">
              <label className="block text-[11px] text-gray-700 mb-1">Attach to</label>
              <select
                value={pdfParentType}
                onChange={(e) => handlePickPdfTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm"
                disabled={pdfParentOptions.length === 0}
              >
                {pdfParentOptions.length === 0 ? (
                  <option value="">Select something first</option>
                ) : (
                  pdfParentOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex-1 min-w-[220px]">
              <label className="block text-[11px] text-gray-700 mb-1">PDF title (optional)</label>
              <input
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm"
                placeholder="Example: Chapter Notes"
              />
            </div>

            <button
              onClick={handlePdfUploadClick}
              disabled={pdfUploading || !pdfParentType || !pdfParentId}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              {pdfUploading ? "Uploading..." : "Upload PDF"}
            </button>

            <input
              ref={pdfFileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: "none" }}
              onChange={handlePdfFileChange}
            />
          </div>
        </div>

        {pdfMessage && <div className="mt-2 text-sm text-green-700 font-medium">{pdfMessage}</div>}

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-orange-800">Attached PDFs</h4>
            {pdfLoading && <span className="text-xs text-gray-600">Loading...</span>}
          </div>

          {!pdfParentType || !pdfParentId ? (
            <p className="text-xs text-gray-600 mt-2">
              Select an Article/Chapter/Topic/Content to view PDFs.
            </p>
          ) : pdfList.length === 0 ? (
            <p className="text-xs text-gray-600 mt-2">No PDFs attached yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {pdfList.map((p) => {
                const id = getId(p);
                const name = p.title || p.originalName || "PDF Document";
                const url = p.url;
                return (
                  <li
                    key={id || name}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 bg-white border border-orange-100 rounded-lg px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-orange-800">{name}</span>
                      <span className="text-[11px] text-gray-600">
                        {p.originalName || p.fileName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {url && (
                        <>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-full text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
                          >
                            View
                          </a>
                          <a
                            href={url}
                            download
                            className="px-3 py-1 rounded-full text-xs bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                          >
                            Download
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => handleRenamePdf(p)}
                        className="px-3 py-1 rounded-full text-xs border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeletePdf(p)}
                        className="px-3 py-1 rounded-full text-xs bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 4 Columns (auto stacks on mobile) */}
      <div className="admin-two-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* ARTICLES */}
        <div className="admin-two-card bg-slate-50/70 border border-orange-100 rounded-xl p-3 flex flex-col">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">1. Articles</h3>

          <form onSubmit={handleSubmitArticle} className="space-y-2 text-xs">
            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
              placeholder="Article title"
              value={articleForm.title}
              onChange={(e) => handleArticleInputChange("title", e.target.value)}
            />
            <textarea
              rows={2}
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Short description (optional)"
              value={articleForm.description}
              onChange={(e) => handleArticleInputChange("description", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Label (optional)"
              value={articleForm.label}
              onChange={(e) => handleArticleInputChange("label", e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loadingArticles}
                className="px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold disabled:opacity-60"
              >
                {articleForm.id ? "Update Article" : "Create Article"}
              </button>
              <button
                type="button"
                onClick={() => setArticleForm({ id: null, title: "", description: "", label: "" })}
                className="px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs"
              >
                Clear
              </button>
              {articleForm.id && (
                <button
                  type="button"
                  onClick={handleDeleteArticle}
                  className="px-2.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              )}
            </div>

            {articleMessageAdmin && <p className="text-[11px] text-green-700 mt-1">{articleMessageAdmin}</p>}
            {loadingArticles && <p className="text-[11px] text-slate-500 mt-1">Loading articles...</p>}
          </form>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {articles.length === 0 ? (
              <p className="text-[11px] text-gray-500">No articles yet.</p>
            ) : (
              articles.map((article) => {
                const id = getId(article);
                const isSelected = selectedArticleId === id;
                return (
                  <button
                    key={id || article.title}
                    type="button"
                    onClick={() => handleSelectArticle(article)}
                    className={`w-full text-left rounded-lg border px-2 py-1.5 text-[11px] mb-1 transition-all ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-800"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{article.title || "Untitled Article"}</div>
                    {article.description && (
                      <div className="text-[10px] text-slate-500 line-clamp-2">{article.description}</div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CHAPTERS */}
        <div className="admin-two-card bg-slate-50/70 border border-orange-100 rounded-xl p-3 flex flex-col">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">2. Chapters</h3>

          <form onSubmit={handleSubmitChapter} className="space-y-2 text-xs">
            <div className="text-[11px] text-slate-600 mb-1">
              Article:{" "}
              <span className="font-semibold">
                {selectedArticleId
                  ? articles.find((a) => getId(a) === selectedArticleId)?.title || selectedArticleId
                  : "Select an article"}
              </span>
            </div>

            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
              placeholder="Chapter title"
              value={chapterForm.title}
              onChange={(e) => handleChapterInputChange("title", e.target.value)}
            />
            <textarea
              rows={2}
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Summary (optional)"
              value={chapterForm.summary}
              onChange={(e) => handleChapterInputChange("summary", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Label (optional)"
              value={chapterForm.label}
              onChange={(e) => handleChapterInputChange("label", e.target.value)}
            />
            <input
              type="number"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Order (optional)"
              value={chapterForm.order}
              onChange={(e) => handleChapterInputChange("order", e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loadingChapters}
                className="px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold disabled:opacity-60"
              >
                {chapterForm.id ? "Update Chapter" : "Create Chapter"}
              </button>
              <button
                type="button"
                onClick={() => setChapterForm({ id: null, title: "", summary: "", label: "", order: "" })}
                className="px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs"
              >
                Clear
              </button>
              {chapterForm.id && (
                <button
                  type="button"
                  onClick={handleDeleteChapter}
                  className="px-2.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              )}
            </div>

            {chapterMessageAdmin && <p className="text-[11px] text-green-700 mt-1">{chapterMessageAdmin}</p>}
          </form>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {!selectedArticleId ? (
              <p className="text-[11px] text-gray-500">Choose an article first.</p>
            ) : chapters.length === 0 ? (
              <p className="text-[11px] text-gray-500">No chapters yet.</p>
            ) : (
              chapters.map((chapter) => {
                const id = getId(chapter);
                const isSelected = selectedChapterId === id;
                return (
                  <button
                    key={id || chapter.title}
                    type="button"
                    onClick={() => handleSelectChapter(chapter)}
                    className={`w-full text-left rounded-lg border px-2 py-1.5 text-[11px] mb-1 transition-all ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-800"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{chapter.title || "Untitled Chapter"}</div>
                    {chapter.summary && <div className="text-[10px] text-slate-500 line-clamp-2">{chapter.summary}</div>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* TOPICS */}
        <div className="admin-two-card bg-slate-50/70 border border-orange-100 rounded-xl p-3 flex flex-col">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">3. Topics</h3>

          <form onSubmit={handleSubmitTopic} className="space-y-2 text-xs">
            <div className="text-[11px] text-slate-600 mb-1">
              Chapter:{" "}
              <span className="font-semibold">
                {selectedChapterId
                  ? chapters.find((c) => getId(c) === selectedChapterId)?.title || selectedChapterId
                  : "Select a chapter"}
              </span>
            </div>

            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
              placeholder="Topic title"
              value={topicForm.title}
              onChange={(e) => handleTopicInputChange("title", e.target.value)}
            />
            <textarea
              rows={2}
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Description (optional)"
              value={topicForm.description}
              onChange={(e) => handleTopicInputChange("description", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Label (optional)"
              value={topicForm.label}
              onChange={(e) => handleTopicInputChange("label", e.target.value)}
            />
            <input
              type="number"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Order (optional)"
              value={topicForm.order}
              onChange={(e) => handleTopicInputChange("order", e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loadingTopics}
                className="px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold disabled:opacity-60"
              >
                {topicForm.id ? "Update Topic" : "Create Topic"}
              </button>
              <button
                type="button"
                onClick={() => setTopicForm({ id: null, title: "", description: "", label: "", order: "" })}
                className="px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs"
              >
                Clear
              </button>
              {topicForm.id && (
                <button
                  type="button"
                  onClick={handleDeleteTopic}
                  className="px-2.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              )}
            </div>

            {topicMessageAdmin && <p className="text-[11px] text-green-700 mt-1">{topicMessageAdmin}</p>}
          </form>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {!selectedChapterId ? (
              <p className="text-[11px] text-gray-500">Choose a chapter first.</p>
            ) : topics.length === 0 ? (
              <p className="text-[11px] text-gray-500">No topics yet.</p>
            ) : (
              topics.map((topic) => {
                const id = getId(topic);
                const isSelected = selectedTopicId === id;
                return (
                  <button
                    key={id || topic.title}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left rounded-lg border px-2 py-1.5 text-[11px] mb-1 transition-all ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-800"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{topic.title || "Untitled Topic"}</div>
                    {topic.description && <div className="text-[10px] text-slate-500 line-clamp-2">{topic.description}</div>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CONTENTS */}
        <div className="admin-two-card bg-slate-50/70 border border-orange-100 rounded-xl p-3 flex flex-col">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">4. Content Blocks</h3>

          <form onSubmit={handleSubmitContent} className="space-y-2 text-xs">
            <div className="text-[11px] text-slate-600 mb-1">
              Topic:{" "}
              <span className="font-semibold">
                {selectedTopicId
                  ? topics.find((t) => getId(t) === selectedTopicId)?.title || selectedTopicId
                  : "Select a topic"}
              </span>
            </div>

            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
              placeholder="Heading (optional)"
              value={contentForm.heading}
              onChange={(e) => handleContentInputChange("heading", e.target.value)}
            />
            <textarea
              rows={3}
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Body text (required)"
              value={contentForm.body}
              onChange={(e) => handleContentInputChange("body", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Label (optional)"
              value={contentForm.label}
              onChange={(e) => handleContentInputChange("label", e.target.value)}
            />
            <input
              type="number"
              className="w-full px-2 py-1.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-xs"
              placeholder="Order (optional)"
              value={contentForm.order}
              onChange={(e) => handleContentInputChange("order", e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loadingContents}
                className="px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold disabled:opacity-60"
              >
                {contentForm.id ? "Update Content" : "Create Content"}
              </button>
              <button
                type="button"
                onClick={() => setContentForm({ id: null, heading: "", body: "", label: "", order: "" })}
                className="px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs"
              >
                Clear
              </button>
              {contentForm.id && (
                <button
                  type="button"
                  onClick={handleDeleteContent}
                  className="px-2.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              )}
            </div>

            {contentMessageAdmin && <p className="text-[11px] text-green-700 mt-1">{contentMessageAdmin}</p>}
          </form>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {!selectedTopicId ? (
              <p className="text-[11px] text-gray-500">Choose a topic first.</p>
            ) : contents.length === 0 ? (
              <p className="text-[11px] text-gray-500">No content blocks yet.</p>
            ) : (
              contents.map((content) => {
                const id = getId(content);
                const isSelected = contentForm.id === id;
                return (
                  <button
                    key={id || content.heading || content.body}
                    type="button"
                    onClick={() => handleSelectContent(content)}
                    className={`w-full text-left rounded-lg border px-2 py-1.5 text-[11px] mb-1 transition-all ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-800"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{content.heading || "Content block"}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-2">{content.body}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AdminTwo;
