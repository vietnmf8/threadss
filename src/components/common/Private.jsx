/* eslint-disable react/prop-types */
import { useMeQuery } from "@/services/auth";
import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

function Navigate({ to }) {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        navigate(to);
    }, [to, navigate]);
    return null;
}

function Private({ children }) {
    const { isError, isLoading } = useMeQuery();
    if (!isLoading && isError) return <Navigate to="/login" />;
    return children;
}

export default Private;
