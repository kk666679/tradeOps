'use client';

import * as React from 'react';

/**
 * Discord widget.
 *
 * Discord exposes a public JSON endpoint for servers with the widget enabled:
 *   https://discord.com/api/guilds/{serverId}/widget.json
 *
 * This returns the server name, online member count, and a list of online
 * members. It does NOT require authentication. To enable it, go to your
 * Discord server settings → Widget → Enable Server Widget.
 *
 * If the server ID is empty, the widget is disabled, or the fetch fails, the
 * component degrades to a simple join card. It never renders a broken state.
 *
 * Privacy note: this fetch is made directly from the visitor's browser to
 * Discord's API. That means Discord sees the visitor's IP address. If that is
 * a concern for your jurisdiction, remove this widget and use only the plain
 * invite link in the Channels section above.
 */

type Props = {
  inviteUrl: string;
  serverId: string;
  serverName: string;
};

type DiscordWidgetData = {
  id: string;
  name: string;
  instant_invite: string | null;
  presence_count: number;
  members: {
    id: string;
    username: string;
    status: string;
    avatar_url: string;
  }[];
};

export function DiscordWidget({ inviteUrl, serverId, serverName }: Props) {
  const [data, setData] = React.useState<DiscordWidgetData | null>(null);
  const [state, setState] = React.useState<'loading' | 'ready' | 'unavailable'>(
    serverId ? 'loading' : 'unavailable',
  );

  React.useEffect(() => {
    if (!serverId) return;

    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(
          `https://discord.com/api/guilds/${serverId}/widget.json`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`Discord widget: ${res.status}`);
        const json = (await res.json()) as DiscordWidgetData;
        if (!cancelled) {
          setData(json);
          setState('ready');
        }
      } catch (err) {
        if (!cancelled && (err as Error).name !== 'AbortError') {
          setState('unavailable');
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [serverId]);

  const onlineCount = data?.presence_count ?? 0;
  const displayedMembers = data?.members?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center gap-3 border-b bg-indigo-500/[0.06] px-5 py-4">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium">{data?.name ?? serverName}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {state === 'ready' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                />
                {onlineCount} {onlineCount === 1 ? 'member' : 'members'} online
              </>
            ) : state === 'loading' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50"
                />
                Checking server…
              </>
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                />
                Community server
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 rounded-lg border bg-muted/30 p-4">
          {state === 'ready' && displayedMembers.length > 0 ? (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Online now
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {displayedMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        member.status === 'online'
                          ? 'bg-emerald-500'
                          : member.status === 'idle'
                            ? 'bg-amber-500'
                            : 'bg-muted-foreground/50'
                      }`}
                    />
                    {member.username}
                  </li>
                ))}
                {onlineCount > displayedMembers.length && (
                  <li className="flex items-center rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                    +{onlineCount - displayedMembers.length} more
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p className="text-sm text-foreground/90">
              Join our community server to discuss TradeOps with other Free
              Zone operators, ask technical questions, and follow release
              notes.
            </p>
          )}
        </div>

        <a
          href={data?.instant_invite ?? inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Join the Discord server
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
          {state === 'ready' && onlineCount > 0
            ? `${onlineCount} ${onlineCount === 1 ? 'person is' : 'people are'} online right now`
            : 'Opens in the Discord app or in your browser'}
        </p>
      </div>
    </div>
  );
}