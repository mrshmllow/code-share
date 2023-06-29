"use client";

import {
  Fragment,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../design/button/Button";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { changeVisibilty } from "./actions";
import { GistContext } from "./store";

export default function NewGistPopup() {
  const searchParams = useSearchParams();
  const gist = useContext(GistContext);
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(searchParams.get("new") === "true");
  const [isBusy, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen === false) {
      router.push(`/${gist.gist.id}`)
    }
  }, [isOpen])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                <div>
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-5 w-fit mx-auto mb-5">
                    <EyeSlashIcon className="w-10 h-10" />
                  </div>
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Keep Private?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    New snippets are private by default. You can change this
                    behaviour in the account settings.
                  </p>
                </div>

                <div className="mt-4 flex gap-2 w-full flex-col sm:flex-row">
                  <Button
                    full
                    disabled={isBusy}
                    onClick={() => setIsOpen(false)}
                    className="order-last"
                  >
                    <Button.Text>Keep Private</Button.Text>
                  </Button>

                  <Button
                    intent="secondary"
                    full
                    onClick={() => {
                      startTransition(() =>
                        changeVisibilty({
                          id: gist.gist.id,
                          visibilty: true,
                        })
                      );
                    }}
                    isBusy={isBusy}
                  >
                    <Button.Icon></Button.Icon>

                    <Button.Text busyText={["Mak", "ing Public"]}>
                      Make Public
                    </Button.Text>
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
