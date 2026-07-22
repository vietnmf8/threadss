import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

/**
 * Custom Hook: useFormWithI18n
 * Mục đích: Tự động validate lại form khi ngôn ngữ thay đổi
 */

export function useFormWithI18n(options) {
    const { i18n } = useTranslation();
    const formMethods = useForm(options);
    const {
        trigger,
        formState: { errors },
    } = formMethods;

    /* Chỉ validate lại nếu form đang có lỗi */
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            trigger();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);
    return formMethods;
}
