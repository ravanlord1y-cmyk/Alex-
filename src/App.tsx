/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatInterface } from "./components/ChatInterface";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-full max-w-5xl overflow-hidden md:rounded-3xl shadow-2xl">
        <ChatInterface />
      </div>
    </div>
  );
}
