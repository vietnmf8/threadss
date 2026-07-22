import React, { useEffect } from "react";
import { useOutletContext } from "react-router";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { useForgotPasswordForm } from "@/features/auth/hooks/useForgotPasswordForm";
import ForgotPasswordSuccess from "./components/ForgotPasswordSuccess";

function ForgotPassword() {
    // Ẩn QR Code ở layout cha (AuthLayout)
    const { setIsQRCodeHidden } = useOutletContext();

    const {
        register,
        handleSubmit,
        errors,
        isValid,
        isLoading,
        isSuccess,
        submittedEmail,
    } = useForgotPasswordForm();

    useEffect(() => {
        setIsQRCodeHidden(true);
        // Cleanup: Hiện lại QR khi rời trang (ví dụ quay lại login)
        return () => setIsQRCodeHidden(false);
    }, [setIsQRCodeHidden]);

    /* Nếu thành công thì chuyển sang trang thông báo */
    if (isSuccess) {
        return <ForgotPasswordSuccess email={submittedEmail} />;
    }

    return (
        <ForgotPasswordForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isValid={isValid}
            isLoading={isLoading}
        />
    );
}

export default ForgotPassword;
