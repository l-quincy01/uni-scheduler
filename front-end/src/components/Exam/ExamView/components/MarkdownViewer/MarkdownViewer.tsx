import MarkdownPreview from "@uiw/react-markdown-preview";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownViewerProps {
  markdown_source: string;
}

export default function MarkdownViewer({
  markdown_source,
}: MarkdownViewerProps) {
  const rehypePlugins = [rehypeSanitize];
  return (
    <MarkdownPreview
      source={markdown_source}
      style={{
        // padding: 16,
        background: "transparent",
      }}
      rehypePlugins={rehypePlugins}
      components={{
        code: ({ children = [], className, ...props }) => {
          if (typeof children === "string" && /^\$\$(.*)\$\$/.test(children)) {
            const html = katex.renderToString(
              children.replace(/^\$\$(.*)\$\$/, "$1"),
              {
                throwOnError: false,
              }
            );
            return (
              <code
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ background: "transparent" }}
              />
            );
          }
          const code =
            props.node && props.node.children
              ? getCodeString(props.node.children)
              : children;
          if (
            typeof code === "string" &&
            typeof className === "string" &&
            /^language-katex/.test(className.toLocaleLowerCase())
          ) {
            const html = katex.renderToString(code, {
              throwOnError: false,
            });
            return (
              <code
                style={{ fontSize: "150%" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          return <code className={String(className)}>{children}</code>;
        },
      }}
    />
  );
}
