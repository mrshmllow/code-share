import { Combobox, Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import {
  CheckIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Configure,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web";

type Base = {
  label: string;
  id: string;
  inner?: (ActionItem | LinkItem)[];
  icon?: ReturnType<typeof CheckIcon>;
  type: "action" | "link" | "search";
};

type ActionItem = {
  onActivate: () => void;
  type: "action";
} & Base;

type LinkItem = {
  href: string;
} & Base;

type Item = Base | LinkItem | ActionItem;

export default function Palette({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const session = useSession();
  const hits = useHits();
  const search = useSearchBox();

  const items = useMemo<(ActionItem | LinkItem)[]>(() => {
    let items: (ActionItem | LinkItem)[] = [
      {
        label: "New Snippet",
        id: "new",
        href: "/new",
        icon: <SparklesIcon />,
        type: "action",
      },
    ];

    if (session.status === "authenticated" && session.data.user) {
      items.push(
        {
          label: session.data.user.name ?? "Your Profile",
          id: "profile",
          href: `/${session.data.user.id}`,
          icon: <UserIcon />,
          type: "link",
        },
        {
          label: "Settings",
          id: "settings",
          href: "/settings",
          icon: <Cog6ToothIcon />,
          type: "link",
        }
      );
    }

    items = [
      ...items,
      ...hits.hits.map(
        (hit) =>
          ({
            label: (hit["name"] as string | undefined) ?? "Unknown Gist",
            id: hit.objectID,
            type: "search",
            href: `/${hit["owner"]}/${hit.objectID}`,
          } as const)
      ),
    ];

    return items;
  }, [session, hits]);

  const filteredItems =
    query === ""
      ? items.filter((item) => !(item.type === "action"))
      : items.filter((item) => {
          if (item.type === "search") {
            return !query.startsWith(">");
          }

          if (item.type === "action") {
            if (!query.startsWith(">")) {
              return false;
            }

            return item.label
              .toLowerCase()
              .includes(query.toLowerCase().substring(1));
          }

          return item.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Configure hitsPerPage={5} />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex pt-14 justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-white text-center align-middle shadow-xl transition-all">
                <div className="flex w-full flex-col">
                  <Combobox
                    onChange={(item: Item) => {
                      if (!item) {
                        return;
                      }

                      if ("href" in item) {
                        router.push(item.href);
                      }

                      onClose && onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 pl-5 border-b border-b-gray-100 p-4">
                      <MagnifyingGlassIcon className="w-5 h-5" />

                      <Combobox.Input
                        onChange={(event) => {
                          setQuery(event.target.value);

                          if (!event.target.value.startsWith(">"))
                            search.refine(event.target.value);
                        }}
                        className="w-full outline-none"
                        placeholder="Search or jump to..."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-label="Command Pallete input"
                      />
                    </div>

                    {query.length <= 0 && (
                      <div className="text-sm p-2 pl-5 pb-0 text-left">
                        <p>
                          <strong>Tip: </strong>
                          Type {">"} to run commands
                        </p>
                      </div>
                    )}

                    <Combobox.Options className="max-h-80 rounded-b-2xl overflow-auto p-2 z-10 bg-white w-full">
                      {filteredItems.length === 0 && query !== "" ? (
                        <p className="rounded-lg py-2 pl-10 pr-4 text-left">
                          Nothing Found
                        </p>
                      ) : (
                        filteredItems.map((item) => (
                          <Combobox.Option
                            key={item.id}
                            value={item}
                            className={({ active }) =>
                              `relative flex justify-between cursor-default rounded-lg select-none py-2 pl-10 pr-4 text-left ${
                                active ? "bg-gray-100" : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    active ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {item.label}
                                </span>

                                {item.icon ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400`}
                                    aria-hidden="true"
                                  >
                                    <span className="h-5 w-5">{item.icon}</span>
                                  </span>
                                ) : null}

                                {active && (
                                  <span className="text-gray-600">
                                    {item.type === "action"
                                      ? "Run Command"
                                      : "Jump To"}
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Combobox>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
