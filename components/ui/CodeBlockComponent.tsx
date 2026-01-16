import "./styles.css";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default ({
  node: {
    // @ts-ignore
    attrs: { language: defaultLanguage },
  },
  // @ts-ignore
  updateAttributes,
  // @ts-ignore
  extension,
}) => (
  <NodeViewWrapper className="code-block">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event) => updateAttributes({ language: event.target.value })}
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {/* @ts-ignore */}
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      {/* @ts-ignore */}
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
);
