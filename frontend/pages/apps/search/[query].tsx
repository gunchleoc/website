import { Trans, useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import Spinner from "src/components/Spinner"
import Collection from "../../../src/components/application/Collection"
import { useSearchQuery } from "../../../src/hooks/useSearchQuery"
import { useLocalStorage } from "../../../src/hooks/useLocalStorage"

export default function Search() {
  const { t } = useTranslation()
  const router = useRouter()
  const { query } = router.query
  const [freeSoftwareOnly, setFreeSoftwareOnly] = useLocalStorage(
    "search-free-software-only",
    false,
  )

  const searchResult = useSearchQuery(query as string, freeSoftwareOnly)

  return (
    <>
      <NextSeo
        title={t("search-for-query", { query })}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_SITE_BASE_URI}/apps/search/${query}`,
        }}
      />

      <div className="max-w-11/12 mx-auto my-0 mt-6 w-11/12 2xl:w-[1400px] 2xl:max-w-[1400px]">
        {!searchResult && <Spinner size="l" />}
        {searchResult && searchResult.length > 0 && (
          <Collection
            title={t("search-for-query", { query })}
            applications={searchResult}
            freeSoftwareOnly={freeSoftwareOnly}
            setFreeSoftwareOnly={setFreeSoftwareOnly}
          />
        )}
        {searchResult && searchResult.length === 0 && (
          <>
            <h2 className="mb-6 mt-12 text-2xl font-bold">
              {t("search-for-query", { query })}
            </h2>
            <p>{t("could-not-find-match-for-search")}</p>
            <p>
              <Trans i18nKey={"common:request-new-app"}>
                If you&apos;re searching for a specific application, let the
                community know, that you want it on flathub
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline hover:underline"
                  href="https://discourse.flathub.org/t/about-the-requests-category/22"
                >
                  here
                </a>
                .
              </Trans>
            </p>
          </>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  }
}
