import React, { useEffect } from "react";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import RegisterSuccess from "./components/RegisterSuccess";
import RegisterForm from "./components/RegisterForm";
import { useOutletContext } from "react-router";

function Register() {
    const {
        register,
        handleSubmit,
        watch,
        errors,
        isValid,
        isLoading,
        isCheckingEmail,
        isCheckingUsername,
        isSuccess,
        submittedEmail,
    } = useRegisterForm();

    // Lấy hàm điều khiển QR Code từ Layout
    const { setIsQRCodeHidden } = useOutletContext();

    // Effect: Khi isSuccess thay đổi -> Cập nhật trạng thái ẩn/hiện QR Code ở Layout
    useEffect(() => {
        setIsQRCodeHidden(isSuccess);

        // Cleanup: Khi component unmount (rời trang), hiện lại QR Code
        return () => setIsQRCodeHidden(false);
    }, [isSuccess, setIsQRCodeHidden]);

    /* Render */
    if (isSuccess) {
        return <RegisterSuccess email={submittedEmail} />;
    }

    return (
        <RegisterForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            isValid={isValid}
            isLoading={isLoading}
            isCheckingEmail={isCheckingEmail}
            isCheckingUsername={isCheckingUsername}
        />
    );
}

export default Register;
