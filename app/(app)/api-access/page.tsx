import { headers } from "next/headers";
import { requireUser } from "@/lib/auth";
import { CopyButton, PageTitle, Panel, btnDanger } from "@/components/ui";
import { regenerateApiKeyAction } from "@/app/actions/user";

export const metadata = { title: "API" };

export default async function ApiAccess() {
  const user = await requireUser();
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "yourdomain.com";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const url = `${proto}://${host}/api/v2`;
  const code = "rounded bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700 border border-blue-200";

  return (
    <>
      <PageTitle
        title="Reseller API (v2)"
        sub="Connect your external SMM panel, bot, or application via our standard REST API."
      />
      <div className="max-w-4xl space-y-6">
        {/* Credentials Card */}
        <Panel className="p-6 bg-white border border-slate-200 shadow-xs">
          <h2 className="mb-4 text-base font-bold text-slate-900 border-b border-slate-200 pb-3">Your API Credentials</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Endpoint URL</p>
              <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5">
                <code className="font-mono text-sm text-slate-900 font-bold select-all">{url}</code>
                <CopyButton text={url} label="Copy URL" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secret API Key</p>
              <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5">
                <code className="font-mono text-sm text-amber-700 font-bold select-all break-all">{user.apiKey}</code>
                <CopyButton text={user.apiKey} label="Copy Key" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <form action={regenerateApiKeyAction}>
                <button className={btnDanger}>Regenerate New API Key</button>
              </form>
              <span className="text-xs text-slate-500">Regenerating immediately disables your previous key.</span>
            </div>
          </div>
        </Panel>

        {/* API Reference */}
        <Panel className="p-6 text-sm leading-relaxed text-slate-700 bg-white border border-slate-200 shadow-xs">
          <h2 className="mb-4 text-base font-bold text-slate-900 border-b border-slate-200 pb-3">API Parameters & Actions</h2>
          <p>
            Send HTTP <code className={code}>POST</code> requests (application/json or form-data) with your{" "}
            <code className={code}>key</code> and <code className={code}>action</code>.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Parameters</th>
                  <th className="px-4 py-3">Example Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">services</td>
                  <td className="px-4 py-3 text-slate-600">None</td>
                  <td className="px-4 py-3 font-mono text-slate-700">[{`{"service":1,"name":"...","rate":"1.20"}`}]</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">add</td>
                  <td className="px-4 py-3 text-slate-600">service, link, quantity</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{`{"order": 1024}`}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">status</td>
                  <td className="px-4 py-3 text-slate-600">order (single ID) or orders (1,2,3)</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{`{"status":"Completed","remains":"0"}`}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">balance</td>
                  <td className="px-4 py-3 text-slate-600">None</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{`{"balance":"500.00","currency":"BDT"}`}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-2 text-sm font-bold text-slate-900">cURL Example (Add Order):</h3>
          <div className="relative">
            <pre className="overflow-x-auto rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 p-4 font-mono text-xs">
{`curl -X POST ${url} \\
  -d "key=${user.apiKey}" \\
  -d "action=add" \\
  -d "service=1" \\
  -d "link=https://example.com/post" \\
  -d "quantity=1000"`}
            </pre>
          </div>
        </Panel>
      </div>
    </>
  );
}
