export default function AboutJsonTab() {
  return (
    <div className="info-tab">
      <h2 className="tab-h2">About JSON</h2>
      <p className="tab-lead">
        <strong>JSON</strong> (JavaScript Object Notation) is a lightweight, text-based data
        interchange format. It is easy for humans to read and write, and easy for machines to
        parse and generate.
      </p>

      <h3 className="tab-h3">Data types</h3>
      <p>JSON supports the following value types:</p>
      <ul className="tab-list">
        <li><strong>object</strong> &mdash; an unordered collection of key/value pairs (<code>{'{}'}</code>)</li>
        <li><strong>array</strong> &mdash; an ordered list of values (<code>[]</code>)</li>
        <li><strong>string</strong> &mdash; text wrapped in double quotes (<code>&quot;hello&quot;</code>)</li>
        <li><strong>number</strong> &mdash; integer or floating point (<code>42</code>, <code>3.14</code>)</li>
        <li><strong>boolean</strong> &mdash; <code>true</code> or <code>false</code></li>
        <li><strong>null</strong> &mdash; the empty value (<code>null</code>)</li>
      </ul>

      <h3 className="tab-h3">Example</h3>
      <pre className="tab-pre">
{`{
  "firstName": "John",
  "lastName": "Smith",
  "age": 32,
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021"
  },
  "phoneNumbers": [
    { "type": "home", "number": "212 555-1234" },
    { "type": "fax", "number": "646 555-4567" }
  ]
}`}
      </pre>

      <h3 className="tab-h3">Learn more</h3>
      <p>
        Read the full specification at <a href="https://www.json.org" target="_blank" rel="noopener noreferrer">json.org</a>,
        or check the <a href="https://en.wikipedia.org/wiki/JSON" target="_blank" rel="noopener noreferrer">Wikipedia article</a> for
        a deeper overview.
      </p>
    </div>
  )
}
