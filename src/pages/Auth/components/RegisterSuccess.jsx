import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import paths from "@/configs/path";
import { ThreadsIcon } from "@/assets/icons";
import EmailHighlight from "./EmailHighlight";

function RegisterSuccess({ email }) {
    const { t } = useTranslation(["auth"]);

    return (
        <div className="flex w-full flex-col items-center px-4 text-center min-[520px]:px-0">
            <div className="mb-4 hidden items-center justify-center min-[520px]:flex">
                <ThreadsIcon className="text-threads-text h-15 w-15" />
            </div>

            {/* Title */}
            <h2 className="text-threads-text mb-2 text-xl font-bold">
                {t("auth:register_success_title")}
            </h2>

            {/* Desc */}

            <div className="text-threads-dim mb-8 flex flex-col items-center text-[15px] leading-relaxed md:block md:max-w-105 md:text-balance">
                <Trans
                    i18nKey="auth:register_success_desc"
                    values={{ email }}
                    components={{
                        highlight: <EmailHighlight />,
                    }}
                />
            </div>

            {/* Actions */}
            <Link to={paths.login} className="w-full">
                <Button className="bg-threads-button-bg text-threads-button-text hover:bg-threads-button-bg h-13.5 w-full cursor-pointer rounded-xl text-[15px] font-semibold active:scale-95">
                    {t("auth:back_to_login")}
                </Button>
            </Link>
        </div>
    );
}

RegisterSuccess.propTypes = {
    email: PropTypes.string.isRequired,
};

export default RegisterSuccess;
