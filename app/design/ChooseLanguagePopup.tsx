import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import Button from "@/app/design/button/Button";
import hljs from "highlight.js";
import { CheckIcon } from "@heroicons/react/24/outline";
import TextInput from "./form/TextInput";

const languages = hljs.listLanguages();

export default function ChooseLanguagePopup({
  initalLanguage,
  isOpen,
  onPickLanguage,
}: {
  initalLanguage: string | null;
  isOpen: boolean;
  onPickLanguage: (language: string) => Promise<void>;
}) {
  const [isBusy, setIsBusy] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(
    initalLanguage ? initalLanguage : languages[0]
  );

  const [query, setQuery] = useState("");

  const filteredLanguages =
    query === ""
      ? languages
      : languages.filter((lang) => {
        return lang.toLowerCase().includes(query.toLowerCase());
      });

  const pickLanguage = async () => {
    if (selectedLanguage !== undefined) {
      setIsBusy(true);
      await onPickLanguage(selectedLanguage);
      setIsBusy(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={async () => await pickLanguage()}
      >
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Pick Language
                </Dialog.Title>

                <div className="mt-4 flex gap-2 w-full flex-col">
                  <Combobox
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                  >
                    <div className="relative">
                      <div className="">
                        <Combobox.Input
                          as={TextInput}
                          full={true}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                      </div>

                      <Combobox.Options className="absolute max-h-60 overflow-auto rounded-md py-2 shadow-lg text-sm z-10 bg-white w-full">
                        {filteredLanguages.length === 0 && query !== "" ? (
                          <p>Nothing Found</p>
                        ) : (
                          filteredLanguages.map((language) => (
                            <Combobox.Option
                              key={language}
                              value={language}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 text-left ${active
                                  ? "bg-indigo-500 text-white"
                                  : "text-gray-900"
                                }`
                              }
                            >
                              {({ active, selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected ? "font-medium" : "font-normal"
                                      }`}
                                  >
                                    {language}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active
                                          ? "text-white"
                                          : "text-indigo-500"
                                        }`}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>

                  <Button
                    full
                    isBusy={isBusy}
                    onClick={async () => await pickLanguage()}
                  >
                    <Button.Icon />
                    <Button.Text busyText={["Updat", "ing"]}>Update</Button.Text>
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
