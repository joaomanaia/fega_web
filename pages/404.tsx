/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAppThemeLight,
  setAppThemeLight,
  setAppThemeNight,
} from "../app/appSlice";
import en from "../locales/en";
import pt from "../locales/pt";

type NotFoundPageType = {};

const NotFoundPage: NextPage<NotFoundPageType> = () => {
  const appThemeLight = useSelector(selectAppThemeLight);
  const dispatch = useDispatch();

  const router = useRouter();
  const { locale } = router;
  const t = locale === "en" ? en : pt;

  useEffect(() => {
    localStorage.getItem("theme") === "light"
      ? dispatch(setAppThemeLight())
      : dispatch(setAppThemeNight());
  }, [dispatch]);

  return (
    <div className={appThemeLight ? "" : "dark"}>
      <div className="flex items-center justify-center w-screen h-screen bg-white dark:bg-gray-900">
        <div className="flex space-x-10">
          <h1 className="text-6xl font-bold text-red-700 dark:text-red-500">
            404
          </h1>
          <div className="w-1 h-24 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
          <div className="flex flex-col">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-300">
              {t.page_not_found}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">
              {t.this_page_does_not_exist}
            </p>
            <div className="flex space-x-2 mt-16">
              <button
                onClick={() => router.push("/")}
                className="button-primary"
              >
                {t.go_back_home}
              </button>
              <button onClick={() => {}} className="button-outline">
                {t.contact_support}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
