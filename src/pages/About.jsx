// src/pages/About.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import templeImg from "../assets/about.jpeg";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const About = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="relative flex flex-col min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ✅ Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher variant="frost" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Image */}
            <motion.div
              className="relative inline-flex items-center justify-center mb-8"
              variants={itemVariants}
            >
              <div className="absolute w-[120%] h-[120%] rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 blur-3xl opacity-30 animate-pulse" />

              <div className="relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <img
                      src={templeImg}
                      alt={t("about_hero_image_alt")}
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-75" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 mb-3 px-4"
              variants={itemVariants}
            >
              {t("about_hero_title")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-amber-700 font-semibold mb-8 px-4"
              variants={itemVariants}
            >
              {t("about_hero_subtitle")}
            </motion.p>

            {/* Main Content Card */}
            <motion.div
              className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border border-orange-200"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <AutoStoriesIcon className="text-white" sx={{ fontSize: { xs: 24, sm: 28 } }} />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 text-slate-700 leading-relaxed text-left">
                <p className="text-sm sm:text-base lg:text-lg">
                  {t("about_para_1_prefix")}{" "}
                  <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-extrabold text-base sm:text-lg lg:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {t("about_person_name")}
                  </span>
                  {t("about_para_1_suffix")}
                </p>

                <p className="text-sm sm:text-base lg:text-lg">{t("about_para_2")}</p>

                <p className="text-sm sm:text-base lg:text-lg">
                  {t("about_para_3_prefix")}{" "}
                  <span className="font-bold text-orange-700">{t("about_value_1")}</span>,{" "}
                  <span className="font-bold text-orange-700">{t("about_value_2")}</span>,{" "}
                  {t("about_para_3_mid")}{" "}
                  <span className="font-bold text-orange-700">{t("about_value_3")}</span>.
                  {t("about_para_3_suffix")}
                </p>

                <p className="text-sm sm:text-base lg:text-lg">{t("about_para_4")}</p>

                {/* Quote */}
                <div className="mt-6 rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5">
                  <p className="text-center text-base sm:text-lg lg:text-xl font-bold text-orange-700 italic">
                    {t("about_quote")}
                  </p>
                </div>

                {/* Signature */}
                <div className="pt-4 text-center border-t border-orange-100 mt-6">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1">{t("about_signature_prefix")}</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{t("about_signature_line_1")}</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{t("about_signature_line_2")}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative */}
        <div className="absolute top-10 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-orange-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-5 w-20 h-20 sm:w-32 sm:h-32 bg-amber-200 rounded-full blur-3xl opacity-40" />
      </section>

      {/* Mission Section */}
      <section className="px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-lg">
              <AutoStoriesIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold text-sm sm:text-base">{t("about_mission_badge")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-4 sm:mb-6 px-4">
              {t("about_mission_title")}
            </h2>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-orange-200"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed mb-6 sm:mb-8">
              {t("about_mission_desc")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: <AutoStoriesIcon />, title: t("about_card_1_title"), desc: t("about_card_1_desc") },
                { icon: <PeopleIcon />, title: t("about_card_2_title"), desc: t("about_card_2_desc") },
                { icon: <FavoriteIcon />, title: t("about_card_3_title"), desc: t("about_card_3_desc") },
                { icon: <EmojiEventsIcon />, title: t("about_card_4_title"), desc: t("about_card_4_desc") },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                    {React.cloneElement(item.icon, {
                      className: "text-white",
                      sx: { fontSize: { xs: 20, sm: 24 } },
                    })}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-4 px-4">
              {t("about_values_title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              { title: t("about_value_card_1_title"), icon: "🙏", desc: t("about_value_card_1_desc") },
              { title: t("about_value_card_2_title"), icon: "📚", desc: t("about_value_card_2_desc") },
              { title: t("about_value_card_3_title"), icon: "💖", desc: t("about_value_card_3_desc") },
              { title: t("about_value_card_4_title"), icon: "🤝", desc: t("about_value_card_4_desc") },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-center">
                  {value.icon}
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-1 sm:mb-2 text-center">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center text-white relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 px-4">
            {t("about_cta_title")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl mb-6 sm:mb-8 opacity-95 px-4">
            {t("about_cta_desc")}
          </p>

          <motion.button
            className="bg-white text-orange-600 font-bold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsContactOpen(true)}
          >
            {t("about_cta_button")}
          </motion.button>
        </motion.div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsContactOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden"
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 sm:p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">{t("about_contact_title")}</h3>
                    <p className="text-white/95 text-xs sm:text-sm">{t("about_contact_subtitle")}</p>
                  </div>
                  <button
                    onClick={() => setIsContactOpen(false)}
                    className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                    aria-label="Close"
                  >
                    <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4 sm:space-y-5">
                  {[
                    { icon: <PersonIcon />, title: t("about_contact_name"), subtitle: t("about_contact_relation") },
                    { icon: <FavoriteIcon />, title: t("about_contact_org"), subtitle: t("about_contact_org_sub") },
                    { icon: <LocationOnIcon />, title: t("about_contact_address_title"), subtitle: t("about_contact_address") },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                        {React.cloneElement(item.icon, {
                          className: "text-orange-600",
                          sx: { fontSize: { xs: 18, sm: 20 } },
                        })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600 break-words">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <MailOutlineIcon className="text-orange-600" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm sm:text-base">{t("about_contact_email_title")}</p>
                      <a
                        href="mailto:sriandhravalmiki@gmail.com"
                        className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 underline break-all"
                      >
                        {t("about_contact_email")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsContactOpen(false)}
                    className="flex-1 px-5 py-2.5 sm:py-3 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition font-semibold text-sm sm:text-base"
                  >
                    {t("close")}
                  </button>
                  <a
                    href="mailto:sriandhravalmiki@gmail.com"
                    className="flex-1 px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl transition text-center text-sm sm:text-base"
                  >
                    {t("about_contact_email_now")}
                  </a>
                </div>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default About;