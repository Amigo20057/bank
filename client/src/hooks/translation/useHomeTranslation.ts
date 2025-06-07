import { useEffect, useState } from "react";
import { homeTranslations } from "../../i18n/home";

type Lang = "EN" | "UA";

export const useHomeTranslation = () => {
	const [lang, setLang] = useState<Lang>("EN");

	useEffect(() => {
		const saved = localStorage.getItem("language");
		if (saved === "UA" || saved === "EN") setLang(saved);
	}, []);

	const t = homeTranslations[lang];
	return { t, lang };
};
