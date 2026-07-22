import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "vi",
        lng: undefined,
        ns: ["common", "auth", "zod", "home", "settings"],
        defaultNS: "common",
        detection: {
            order: [
                "querystring",
                "cookie",
                "localStorage",
                "navigator",
                "htmlTag",
            ],
            lookupQuerystring: "hl",
            caches: ["localStorage", "cookie"],
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });
z.setErrorMap(makeZodI18nMap({ ns: "zod", handlePath: "zod" }));

export default i18n;
