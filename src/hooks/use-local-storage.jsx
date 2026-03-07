"use client"

import { useState, useEffect } from "react"

export function useLocalStorage(key, initialValue) {
    // Trạng thái để lưu giá trị
    const [storedValue, setStoredValue] = useState(initialValue)

    // Khởi tạo giá trị từ localStorage hoặc sử dụng giá trị mặc định
    useEffect(() => {
        try {
            // Lấy từ localStorage theo key
            const item = window.localStorage.getItem(key)
            // Parse giá trị lưu trữ hoặc trả về initialValue
            setStoredValue(item ? JSON.parse(item) : initialValue)
        } catch (error) {
            // Nếu có lỗi, sử dụng giá trị mặc định
            console.log("Error reading from localStorage:", error)
            setStoredValue(initialValue)
        }
    }, [key, initialValue])

    // Hàm để cập nhật giá trị trong localStorage
    const setValue = value => {
        try {
            // Cho phép value là một function
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            // Lưu vào state
            setStoredValue(valueToStore)
            // Lưu vào localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.log("Error saving to localStorage:", error)
        }
    }

    return [storedValue, setValue]
}
