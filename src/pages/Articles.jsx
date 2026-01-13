import React, { useEffect, useMemo, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TopicIcon from "@mui/icons-material/Topic";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useTranslation } from "react-i18next";

// ✅ IMPORTANT: your content APIs are mounted at /api/content
const API_BASE_URL = "http://localhost:5000/api/content";

const normalizeArrayResponse = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data; // {success:true,data:[...]}
  if (raw && Array.isArray(raw.items)) return raw.items;
  return [];
};

const getId = (item) =>
  item?.id ??
  item?._id ??
  item?.articleId ??
  item?.chapterId ??
  item?.topicId ??
  item?.contentId ??
  null;

const Articles = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // ✅ pick localized field if present: title_te, description_te, body_te...
  const pick = (obj, field, fallback = "") => {
    if (!obj) return fallback;
    if (lang !== "en") {
      const k = `${field}_${lang}`;
      if (obj[k]) return obj[k];
    }
    return obj[field] ?? fallback;
  };

  const [articles, setArticles] = useState([]);
  const [chaptersByArticle, setChaptersByArticle] = useState({});
  const [topicsByChapter, setTopicsByChapter] = useState({});
  const [contentsByTopic, setContentsByTopic] = useState({});

  const [loading, setLoading] = useState({
    articles: false,
    chapters: false,
    topics: false,
    contents: false,
  });

  const [error, setError] = useState("");

  const [view, setView] = useState({
    level: "articles",
    articleId: null,
    chapterId: null,
    topicId: null,
  });

  // ✅ PDFs cache: key = `${parentType}:${parentId}`
  const [pdfsByKey, setPdfsByKey] = useState({});
  const [pdfLoadingByKey, setPdfLoadingByKey] = useState({});

  const fetchPdfs = async (parentType, parentId) => {
    if (!parentType || !parentId) return;
    const key = `${parentType}:${parentId}`;
    if (pdfsByKey[key]) return; // cache hit

    setPdfLoadingByKey((p) => ({ ...p, [key]: true }));
    try {
      const res = await fetch(
        `${API_BASE_URL}/pdfs?parentType=${encodeURIComponent(
          parentType
        )}&parentId=${encodeURIComponent(parentId)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch PDFs");

      const list = normalizeArrayResponse(json);
      setPdfsByKey((p) => ({ ...p, [key]: list }));
    } catch (e) {
      console.error(e);
      setPdfsByKey((p) => ({ ...p, [key]: [] }));
    } finally {
      setPdfLoadingByKey((p) => ({ ...p, [key]: false }));
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading((p) => ({ ...p, articles: true }));
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/articles`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const json = await res.json();
        setArticles(normalizeArrayResponse(json));
      } catch (e) {
        console.error(e);
        setError(t("no_articles"));
      } finally {
        setLoading((p) => ({ ...p, articles: false }));
      }
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const fetchChaptersForArticle = async (articleId) => {
    if (!articleId || chaptersByArticle[articleId]) return;
    setLoading((p) => ({ ...p, chapters: true }));
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/chapters?articleId=${encodeURIComponent(articleId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch chapters");
      const json = await res.json();
      setChaptersByArticle((p) => ({
        ...p,
        [articleId]: normalizeArrayResponse(json),
      }));

      // ✅ Optional: if you attach PDFs to Article in admin, fetch them too
      fetchPdfs("article", articleId);
    } catch (e) {
      console.error(e);
      setError(t("no_chapters"));
    } finally {
      setLoading((p) => ({ ...p, chapters: false }));
    }
  };

  const fetchTopicsForChapter = async (chapterId) => {
    if (!chapterId || topicsByChapter[chapterId]) return;
    setLoading((p) => ({ ...p, topics: true }));
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/topics?chapterId=${encodeURIComponent(chapterId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch topics");
      const json = await res.json();
      setTopicsByChapter((p) => ({
        ...p,
        [chapterId]: normalizeArrayResponse(json),
      }));

      // ✅ Optional: chapter PDFs
      fetchPdfs("chapter", chapterId);
    } catch (e) {
      console.error(e);
      setError(t("no_topics"));
    } finally {
      setLoading((p) => ({ ...p, topics: false }));
    }
  };

  const fetchContentsForTopic = async (topicId) => {
    if (!topicId || contentsByTopic[topicId]) return;
    setLoading((p) => ({ ...p, contents: true }));
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/contents?topicId=${encodeURIComponent(topicId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch contents");
      const json = await res.json();
      const contents = normalizeArrayResponse(json);
      setContentsByTopic((p) => ({ ...p, [topicId]: contents }));

      // ✅ THIS IS THE MAIN FIX:
      // fetch PDFs attached to this topic
      fetchPdfs("topic", topicId);

      // fetch PDFs attached to each content block
      for (const c of contents) {
        const cid = getId(c);
        if (cid) fetchPdfs("content", cid);
      }
    } catch (e) {
      console.error(e);
      setError(t("no_contents"));
    } finally {
      setLoading((p) => ({ ...p, contents: false }));
    }
  };

  const currentArticle =
    view.articleId != null ? articles.find((a) => getId(a) === view.articleId) : null;

  const currentChapters = currentArticle ? chaptersByArticle[view.articleId] || [] : [];

  const currentChapter =
    view.chapterId != null ? currentChapters.find((c) => getId(c) === view.chapterId) : null;

  const currentTopics = currentChapter ? topicsByChapter[view.chapterId] || [] : [];

  const currentTopic =
    view.topicId != null ? currentTopics.find((tp) => getId(tp) === view.topicId) : null;

  const currentContents = currentTopic ? contentsByTopic[view.topicId] || [] : [];

  const goBack = () => {
    if (view.level === "contents") setView((p) => ({ ...p, level: "topics", topicId: null }));
    else if (view.level === "topics")
      setView((p) => ({ ...p, level: "chapters", chapterId: null }));
    else if (view.level === "chapters")
      setView({ level: "articles", articleId: null, chapterId: null, topicId: null });
  };

  const openArticle = async (article) => {
    const articleId = getId(article);
    setView({ level: "chapters", articleId, chapterId: null, topicId: null });
    await fetchChaptersForArticle(articleId);
  };

  const openChapter = async (chapter) => {
    const chapterId = getId(chapter);
    setView((p) => ({ ...p, level: "topics", chapterId, topicId: null }));
    await fetchTopicsForChapter(chapterId);
  };

  const openTopic = async (topic) => {
    const topicId = getId(topic);
    setView((p) => ({ ...p, level: "contents", topicId }));
    await fetchContentsForTopic(topicId);
  };

  const pageTitle = useMemo(() => {
    switch (view.level) {
      case "articles":
        return t("page_articles_title");
      case "chapters":
        return pick(currentArticle, "title", "Chapters");
      case "topics":
        return pick(currentChapter, "title", "Topics");
      case "contents":
        return pick(currentTopic, "title", "Content");
      default:
        return t("page_articles_title");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.level, currentArticle, currentChapter, currentTopic, lang, t]);

  const pageSubtitle = useMemo(() => {
    switch (view.level) {
      case "articles":
        return t("page_articles_sub");
      case "chapters":
        return t("page_chapters_sub");
      case "topics":
        return t("page_topics_sub");
      case "contents":
        return t("page_contents_sub");
      default:
        return "";
    }
  }, [view.level, t]);

  const PdfList = ({ title, parentType, parentId }) => {
    const key = `${parentType}:${parentId}`;
    const list = pdfsByKey[key] || [];
    const isLoading = !!pdfLoadingByKey[key];

    if (!parentId) return null;

    return (
      <div className="mb-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-orange-700 font-semibold mb-2">
          <PictureAsPdfIcon fontSize="small" />
          <span>{title}</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading PDFs...</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-slate-500"></p>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((p) => {
              const pid = getId(p) || p.url;
              const name = p.title || p.originalName || "PDF";
              return (
                <div
                  key={pid}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2"
                >
                  <div className="text-sm font-semibold text-slate-800 line-clamp-1">{name}</div>

                  <div className="flex items-center gap-2">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 border-2 border-orange-300 hover:border-orange-400 rounded-lg transition-all duration-200"
                    >
                      {t("view_pdf")}
                    </a>
                    <a
                      href={p.url}
                      download
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {t("download")}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 min-h-[70vh]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            {view.level !== "articles" && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-xl border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="text-sm font-medium">{t("back")}</span>
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{pageSubtitle}</p>
            </div>
          </div>

          {view.level === "articles" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-md">
              <MenuBookIcon fontSize="small" />
              <span className="text-sm font-semibold">
                {t("articles_available", { n: articles.length })}
              </span>
            </div>
          )}
          {view.level === "chapters" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-full shadow-md">
              <MenuBookIcon fontSize="small" />
              <span className="text-sm font-semibold">
                {t("chapters_count", { n: currentChapters.length })}
              </span>
            </div>
          )}
          {view.level === "topics" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-full shadow-md">
              <TopicIcon fontSize="small" />
              <span className="text-sm font-semibold">
                {t("topics_count", { n: currentTopics.length })}
              </span>
            </div>
          )}
          {view.level === "contents" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-full shadow-md">
              <DescriptionIcon fontSize="small" />
              <span className="text-sm font-semibold">
                {t("contents_count", { n: currentContents.length })}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ARTICLES */}
        {view.level === "articles" && (
          <>
            {loading.articles && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}

            {articles.length === 0 && !loading.articles ? (
              <div className="text-center py-16 px-4">
                <MenuBookIcon className="!text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500">{t("no_articles")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {articles.map((article, index) => {
                  const id = getId(article);
                  return (
                    <button
                      key={id || pick(article, "title", index)}
                      onClick={() => openArticle(article)}
                      className="group relative h-full flex flex-col bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="relative px-5 py-4 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-base font-bold line-clamp-1">
                              {pick(article, "title", "Untitled Article")}
                            </span>
                          </div>
                          <ArrowForwardIosIcon
                            fontSize="small"
                            className="!text-white group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex-1 px-5 py-5">
                        {pick(article, "description", "") ? (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 group-hover:text-slate-700 transition-colors">
                            {pick(article, "description", "")}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 italic">{t("no_description")}</p>
                        )}
                      </div>

                      <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* CHAPTERS */}
        {view.level === "chapters" && currentArticle && (
          <>
            {/* Optional: Article PDFs */}
            {/* <PdfList title="PDFs for this Article" parentType="article" parentId={view.articleId} /> */}

            {loading.chapters && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
              </div>
            )}

            {currentChapters.length === 0 && !loading.chapters ? (
              <div className="text-center py-16 px-4">
                <MenuBookIcon className="!text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500">{t("no_chapters")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {currentChapters.map((chapter, index) => {
                  const id = getId(chapter);
                  return (
                    <button
                      key={id || pick(chapter, "title", index)}
                      onClick={() => openChapter(chapter)}
                      className="group relative h-full flex flex-col bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="relative px-5 py-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-base font-bold line-clamp-1">
                              {pick(chapter, "title", "Untitled Chapter")}
                            </span>
                          </div>
                          <ArrowForwardIosIcon
                            fontSize="small"
                            className="!text-slate-300 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex-1 px-5 py-5">
                        {pick(chapter, "summary", "") || pick(chapter, "description", "") ? (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 group-hover:text-slate-700 transition-colors">
                            {pick(chapter, "summary", "") || pick(chapter, "description", "")}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 italic">{t("summary_not_added")}</p>
                        )}
                      </div>

                      <div className="h-1 bg-gradient-to-r from-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TOPICS */}
        {view.level === "topics" && currentChapter && (
          <>
            {/* Optional: Chapter PDFs */}
            {/* <PdfList title="PDFs for this Chapter" parentType="chapter" parentId={view.chapterId} /> */}

            {loading.topics && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
              </div>
            )}

            {currentTopics.length === 0 && !loading.topics ? (
              <div className="text-center py-16 px-4">
                <TopicIcon className="!text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500">{t("no_topics")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {currentTopics.map((topic, index) => {
                  const id = getId(topic);
                  return (
                    <button
                      key={id || pick(topic, "title", index)}
                      onClick={() => openTopic(topic)}
                      className="group relative h-full flex flex-col bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="relative px-5 py-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <TopicIcon className="!text-2xl" />
                            <span className="text-base font-bold line-clamp-1">
                              {pick(topic, "title", "Untitled Topic")}
                            </span>
                          </div>
                          <ArrowForwardIosIcon
                            fontSize="small"
                            className="!text-white group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex-1 px-5 py-5">
                        {pick(topic, "description", "") ? (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 group-hover:text-slate-700 transition-colors">
                            {pick(topic, "description", "")}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 italic">{t("description_not_added")}</p>
                        )}
                      </div>

                      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* CONTENTS */}
        {view.level === "contents" && currentTopic && (
          <>
            {/* ✅ Topic PDFs (this is what admin uploads with parentType=topic) */}
            {/* <PdfList title="PDFs for this Topic" parentType="topic" parentId={view.topicId} /> */}

            {loading.contents && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}

            {currentContents.length === 0 && !loading.contents ? (
              <div className="text-center py-16 px-4">
                <DescriptionIcon className="!text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500">{t("no_contents")}</p>
              </div>
            ) : (
              <div className="space-y-5">
                {currentContents.map((content, index) => {
                  const cid = getId(content) || index;

                  return (
                    <div
                      key={cid}
                      className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-orange-50 border-b border-slate-200">
                        <div className="flex items-start gap-4">
                          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 shadow-md">
                            <DescriptionIcon className="!text-white !text-2xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                              {pick(content, "heading", `Content Block ${index + 1}`)}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3">
                              {pick(content, "label", "") && (
                                <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                  {pick(content, "label", "")}
                                </span>
                              )}
                              {content.order !== undefined && content.order !== null && (
                                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                                  Order #{content.order}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-5">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {pick(content, "body", "")}
                        </p>

                        {/* ✅ Content PDFs (this is what admin uploads with parentType=content) */}
                        <div className="mt-5">
                          <PdfList
                            title={`PDFs for Content #${index + 1}`}
                            parentType="content"
                            parentId={getId(content)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Articles;
