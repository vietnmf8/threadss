import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../../../");
const srcDir = path.join(projectRoot, "src");

const auditResults = [];

function logIssue(severity, file, line, rule, message) {
    const relativePath = path.relative(projectRoot, file).replace(/\\/g, "/");
    auditResults.push({ severity, file: relativePath, line, rule, message });
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");

    lines.forEach((lineText, idx) => {
        const lineNum = idx + 1;

        // 1. Check non-passive scroll listener
        if (lineText.includes('addEventListener("scroll"') || lineText.includes("addEventListener('scroll'")) {
            if (!lineText.includes("passive")) {
                logIssue("WARNING", filePath, lineNum, "Non-Passive Scroll Listener", "window.addEventListener('scroll') should use { passive: true } to prevent main-thread scroll jank.");
            }
        }

        // 2. Check unstable keys in map (key={index} or key={i})
        if (/\bkey=\{(index|idx|i)\}/.test(lineText)) {
            logIssue("WARNING", filePath, lineNum, "Unstable React Key", "Using index as key (key={index}) can cause unnecessary re-renders and DOM state bugs.");
        }

        // 3. Check Math.random() as key
        if (/\bkey=\{.*Math\.random\(\).*\}/.test(lineText)) {
            logIssue("ERROR", filePath, lineNum, "Random React Key", "Using Math.random() in key forces React to unmount and remount nodes on every render.");
        }

        // 4. Check Raw fetch or axios in components/pages (outside services/utils)
        if ((relativePath.startsWith("src/components") || relativePath.startsWith("src/pages") || relativePath.startsWith("src/features")) && !relativePath.includes("/services/")) {
            if (/\b(axios\.get|axios\.post|fetch\(|axios\()\b/.test(lineText)) {
                logIssue("ERROR", filePath, lineNum, "Raw API Call in Component", "Raw fetch or axios call detected inside component. Use RTK Query mutations/queries instead.");
            }
        }
    });

    // 5. Check useEffect cleanup presence
    if (content.includes("useEffect") && (content.includes("addEventListener") || content.includes("setInterval") || content.includes("ResizeObserver") || content.includes("IntersectionObserver"))) {
        if (!content.includes("return () =>") && !content.includes("return () => {")) {
            logIssue("WARNING", filePath, 1, "Possible Missing Cleanup", "Component uses event listener or observer in useEffect but may be missing a cleanup return statement.");
        }
    }

    // 6. Check RTK Query optimistic updates rollback
    if (relativePath.includes("services/") && content.includes("onQueryStarted")) {
        if (!content.includes("patchResults") || (!content.includes(".undo()") && !content.includes("undo()"))) {
            logIssue("WARNING", filePath, 1, "Optimistic Update Without Rollback", "RTK Query onQueryStarted should implement rollback via patchResult.undo() inside try/catch.");
        }
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            traverseDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))) {
            scanFile(fullPath);
        }
    }
}

console.log("\n=======================================================");
console.log("   ⚡ THREADS CLONE - PERFORMANCE AUDIT SCANNER ⚡   ");
console.log("=======================================================\n");

traverseDir(srcDir);

if (auditResults.length === 0) {
    console.log("✅ PERFECT! No performance anti-patterns detected in src/");
} else {
    console.log(`Found ${auditResults.length} potential performance issue(s):\n`);
    auditResults.forEach((issue) => {
        const badge = issue.severity === "ERROR" ? "🔴 [ERROR]" : "⚠️ [WARN]";
        console.log(`${badge} [${issue.rule}] ${issue.file}:${issue.line}`);
        console.log(`   └─ ${issue.message}\n`);
    });
}
console.log("=======================================================\n");
