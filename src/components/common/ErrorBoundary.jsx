/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import { Button } from "../ui/button";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // State lưu trạng thái lỗi
        this.state = { hasError: false };
    }

    // Cập nhật state khi có lỗi -> gọi hàm render
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    // Bắt lỗi và trả ra lỗi, bắn lên Sentry
    componentDidCatch(error, errorInfo) {
        Sentry.captureException(error, { extra: errorInfo });
    }

    // Hàm xử lý khi  muốn tải lại trang
    handleReload = () => {
        window.location.reload();
    };

    render() {
        // Nếu có lỗi, hiển thị UI Fallback
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-red-600">
                        Oops! Đã có lỗi xảy ra.
                    </h1>
                    <p className="mb-6 max-w-md text-gray-600">
                        Hệ thống gặp sự cố không mong muốn. Vui lòng liên hệ bộ
                        phận kỹ thuật hoặc thử lại sau.
                    </p>
                    <div className="space-x-4">
                        <Button onClick={this.handleReload} variant="default">
                            Tải lại trang
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    "https://fullstack.edu.vn/discussions",
                                    "_blank",
                                )
                            }
                        >
                            Liên hệ hỗ trợ
                        </Button>
                    </div>
                </div>
            );
        }

        // Nếu không có lỗi, render component con bình thường
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
};

export default ErrorBoundary;
