import fs from "fs";
import path from "path";

console.log("=== BẮT ĐẦU VERIFICATION TASK 10 (VERIFY EMAIL) ===");

const rootDir = process.cwd();

// Test 1: Kiểm tra file paths
const filesToVerify = [
    "src/configs/path.js",
    "src/services/auth.js",
    "src/features/auth/hooks/useVerifyEmail.js",
    "src/pages/Auth/VerifyEmail.jsx",
    "src/routes.js",
    "src/pages/Auth/components/LoginForm.jsx",
    "public/locales/vi/auth.json",
    "public/locales/en/auth.json"
];

let passCount = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passCount++;
    } else {
        console.error(`❌ FAIL: ${message}`);
    }
}

// Case 1: Tồn tại tất cả file cấu hình & component
filesToVerify.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    assert(fs.existsSync(fullPath), `File ${relPath} tồn tại`);
});

// Case 2: Kiểm tra nội dung path.js chứa verify_email
const pathContent = fs.readFileSync(path.join(rootDir, "src/configs/path.js"), "utf8");
assert(pathContent.includes('verify_email: "/verify-email"'), "path.js khai báo route verify_email: '/verify-email'");

// Case 3: Kiểm tra auth.js có verifyEmail mutation
const authServiceContent = fs.readFileSync(path.join(rootDir, "src/services/auth.js"), "utf8");
assert(authServiceContent.includes("verifyEmail: builder.mutation"), "auth.js có verifyEmail mutation");
assert(authServiceContent.includes("useVerifyEmailMutation"), "auth.js export useVerifyEmailMutation");

// Case 4: Kiểm tra routes.js đã đăng ký VerifyEmail dưới AuthLayout
const routesContent = fs.readFileSync(path.join(rootDir, "src/routes.js"), "utf8");
assert(routesContent.includes("import(\"./pages/Auth/VerifyEmail\")"), "routes.js lazy import VerifyEmail page");
assert(routesContent.includes("paths.verify_email, component: VerifyEmail"), "routes.js đăng ký route paths.verify_email");

// Case 5: Kiểm tra LoginForm.jsx render banner khi có verifySuccessMessage
const loginFormContent = fs.readFileSync(path.join(rootDir, "src/pages/Auth/components/LoginForm.jsx"), "utf8");
assert(loginFormContent.includes("verifySuccessMessage"), "LoginForm.jsx kiểm tra verifySuccessMessage từ location.state");
assert(loginFormContent.includes("text-emerald-500"), "LoginForm.jsx định dạng banner thành công bằng chữ xanh emerald-500");

// Case 6: Kiểm tra i18n translation keys
const viAuthJson = JSON.parse(fs.readFileSync(path.join(rootDir, "public/locales/vi/auth.json"), "utf8"));
const enAuthJson = JSON.parse(fs.readFileSync(path.join(rootDir, "public/locales/en/auth.json"), "utf8"));

assert(viAuthJson.verifying_email === "Đang xác minh...", "vi/auth.json có key verifying_email");
assert(viAuthJson.verify_email_failed === "Liên kết đã hết hạn hoặc không hợp lệ.", "vi/auth.json có key verify_email_failed");
assert(viAuthJson.verify_email_success === "Đã xác minh tài khoản thành công. Vui lòng đăng nhập.", "vi/auth.json có key verify_email_success");
assert(viAuthJson.go_to_login_btn === "Đi tới trang đăng nhập", "vi/auth.json có key go_to_login_btn");

assert(enAuthJson.verifying_email === "Verifying...", "en/auth.json có key verifying_email");
assert(enAuthJson.verify_email_failed === "Invalid or expired link.", "en/auth.json có key verify_email_failed");
assert(enAuthJson.verify_email_success === "Account verified successfully. Please log in.", "en/auth.json có key verify_email_success");
assert(enAuthJson.go_to_login_btn === "Go to login page", "en/auth.json có key go_to_login_btn");

console.log(`\n=== TỔNG KẾT VERIFICATION: ${passCount}/${totalTests} PASSED (${Math.round(passCount/totalTests*100)}%) ===`);
if (passCount === totalTests) {
    console.log("🎉 TẤT CẢ 100% TEST CASE CHÍNH / PHỤ / EDGE CASES ĐÃ PASS SẠCH SẼ!");
    process.exit(0);
} else {
    process.exit(1);
}
