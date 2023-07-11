import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import hljs from "highlight.js";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const languages = hljs.listLanguages();

export default function ChooseLanguagePopup({
  initalLanguage,
  isOpen,
  thenFinally,
  onPickLanguage,
}: {
  initalLanguage: string | null;
  isOpen: boolean;
  thenFinally: () => void;
  onPickLanguage: (language: string) => Promise<void>;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [query, setQuery] = useState("");

  const filteredLanguages =
    query === ""
      ? languages
      : languages.filter((lang) => {
          return lang.toLowerCase().includes(query.toLowerCase());
        });

  const pickLanguage = async (language: string | null) => {
    if (language !== null) {
      setIsBusy(true);
      await onPickLanguage(language);
      setIsBusy(false);
    }

    thenFinally();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => thenFinally()}>
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
                    defaultValue={initalLanguage}
                    onChange={async (value) => {
                      await pickLanguage(value);
                    }}
                  >
                    <div className="flex items-center gap-2 pl-5 border-b border-b-gray-100 p-4">
                      <MagnifyingGlassIcon className="w-5 h-5" />

                      <div className="flex w-full">
                        <div className="flex">
                          <Dialog.Title as="h3">Change Language</Dialog.Title>

                          <span
                            aria-hidden="true"
                            className="px-2 text-gray-500"
                          >
                            /
                          </span>
                        </div>

                        <Combobox.Input
                          onChange={(event) => setQuery(event.target.value)}
                          autoFocus={true}
                          className="outline-none"
                          placeholder="Search languages..."
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          aria-label="Language search "
                        />
                      </div>
                    </div>

                    <Combobox.Options className="max-h-80 rounded-b-2xl overflow-auto p-2 z-10 bg-white w-full">
                      {filteredLanguages.length === 0 && query !== "" ? (
                        <p>Nothing Found</p>
                      ) : (
                        filteredLanguages.map((language) => (
                          <Combobox.Option
                            key={language}
                            value={language}
                            className={({ active }) =>
                              `relative flex justify-between cursor-default rounded-lg select-none py-2 pl-10 pr-4 text-left ${
                                active ? "bg-gray-100" : "text-gray-900"
                              }`
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {language}
                                </span>

                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400`}
                                    aria-hidden="true"
                                  >
                                    <CheckIcon className="h-5 w-5" />
                                  </span>
                                ) : null}

                                {active && (
                                  <span className="text-gray-600">
                                    Choose Language
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
