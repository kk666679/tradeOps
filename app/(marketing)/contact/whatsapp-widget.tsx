import * as React from 'react';

/**
 * WhatsApp Business widget.
 *
 * This is a server component. The widget does not require JavaScript on the
 * client because its only action is a link to wa.me. That link opens the
 * WhatsApp app on mobile and WhatsApp Web on desktop.
 *
 * If you want an embedded chat panel (a small iframe-like UI that mimics the
 * WhatsApp interface), you can swap this for a third-party library such as
 * `react-floating-whatsapp`, but be aware that:
 *   1. It requires a client component.
 *   2. It adds a dependency you will need to maintain.
 *   3. It does not give you access to WhatsApp's actual messaging API — it
 *      still just opens a wa.me link under the hood.
 *
 * For most marketing sites, this simpler approach is preferable: no JS, no
 * dependency, and the same end result for the visitor.
 */

type Props = {
  phoneNumber: string;
  defaultMessage: string;
  businessName: string;
};

export function WhatsAppWidget({
  phoneNumber,
  defaultMessage,
  businessName,
}: Props) {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center gap-3 border-b bg-emerald-500/[0.06] px-5 py-4">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium">{businessName}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
            Typically replies within 2 hours
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-foreground/90">
            👋 Hi there! Have a question about TradeOps, pricing, or a Free
            Zone deployment? Message us on WhatsApp and a human will reply.
          </p>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Open WhatsApp chat
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </a>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Opens in the WhatsApp app or WhatsApp Web
        </p>
      </div>
    </div>
  );
}