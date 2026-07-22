import { useState, useCallback, useMemo } from "react";

/**
 * Hook quản lý logic cho chuỗi bài viết (Multi-post)
 */
export const useThreadComposer = () => {
    /* Trạng thái danh sách threads */
    const [threads, setThreads] = useState([
        {
            id: crypto.randomUUID(),
            content: "",
            placeholder: "home:whats_new",
        },
    ]);

    // Trạng thái Topic cho toàn thread
    const [topic, setTopic] = useState("");

    const updateTopic = useCallback((newTopic) => {
        setTopic(newTopic);
    }, []);

    /* Cập nhật nội dung của một block  */
    const updateThreadContent = useCallback((id, newContent) => {
        setThreads((prev) =>
            prev.map((thread) =>
                thread.id === id ? { ...thread, content: newContent } : thread,
            ),
        );
    }, []);

    /* Thêm một block mới vào cuối danh sách */
    const addThread = useCallback(() => {
        const lastThread = threads[threads.length - 1];
        if (lastThread.content.trim() === "") return;

        setThreads((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                content: "",
                placeholder: "home:say_more",
            },
        ]);
    }, [threads]);

    /* Xóa một block  (không cho xóa block đầu tiên) */
    const removeThread = useCallback((id) => {
        setThreads((prev) => {
            if (prev.length <= 1) return prev;
            return prev.filter((thread) => thread.id !== id);
        });
    }, []);

    /* Reset toàn bộ chuỗi về trạng thái ban đầu */
    const resetThreads = useCallback(() => {
        setThreads([
            {
                id: crypto.randomUUID(),
                content: "",
                placeholder: "home:whats_new",
            },
        ]);
        setTopic("");
    }, []);

    /* Validation Logic */
    // Có thể thêm nút "Add to Thread" không?
    const canAddMore = useMemo(() => {
        const lastThread = threads[threads.length - 1];
        return lastThread.content.trim().length > 0;
    }, [threads]);

    // Có thể nhấn nút "Đăng" không?
    const canPost = useMemo(() => {
        return threads.every((thread) => thread.content.trim().length > 0);
    }, [threads]);

    // Modify
    const isModified = useMemo(() => {
        return (
            threads.some((thread) => thread.content.trim().length > 0) ||
            topic.trim().length > 0
        );
    }, [threads, topic]);

    return {
        threads,
        topic,
        updateTopic,
        addThread,
        removeThread,
        updateThreadContent,
        resetThreads,
        canAddMore,
        canPost,
        isModified,
    };
};
