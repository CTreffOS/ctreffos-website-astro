export default async function SiteNotice({ lang }: { lang: string }) {
  if (lang === "de") {
    return <SiteNoticeDe />;
  } else {
    return <SiteNoticeEn />;
  }
}

const SiteNoticeDe = () => {
  return (
    <div className="prose dark:prose-invert">
      <h1>Impressum</h1>

      <p>
        Verantwortlich für den Inhalt dieser Seiten ist der Chaostreff Osnabrück
        e.V..
      </p>

      <dl>
        <dt>E-Mail</dt>
        <dd>
          <a href="mailto:info@chaostreff-osnabrueck.de">
            info@chaostreff-osnabrueck.de
          </a>
        </dd>
        <dt>Internet-Präsenz</dt>
        <dd>
          <a href="https://chaostreff-osnabrueck.de/">
            https://chaostreff-osnabrueck.de/
          </a>
        </dd>
        <dt>Anschrift</dt>
        <dd>
          Tim Klausmeyer
          <br />
          Chaostreff Osnabrück e.V.
          <br />
          c/o AStA der Universität Osnabrück
          <br />
          Alte Münze 12
          <br />
          49074 Osnabrück
        </dd>
      </dl>

      <p>
        Weitere Kontaktmöglichkeiten finden sich auf der Startseite unserer
        Internet-Präsenz.
      </p>

      <p>
        Der Chaostreff Osnabrück e.V. ist eingetragen im Vereinsregister des
        Amtsgerichts Osnabrück und wird unter der Vereinsregister-Nummer 201413
        geführt.
      </p>
    </div>
  );
};

const SiteNoticeEn = () => {
  //   metadata.title = "Chaostreff Osnabrück e.V. - Site Notice";
  return (
    <div className="prose dark:prose-invert">
      <h1>Site Notice</h1>

      <p>
        Responsible for the content of these pages is the Chaostreff Osnabrück
        e.V..
      </p>

      <dl>
        <dt>E-Mail</dt>
        <dd>
          <a href="mailto:info@chaostreff-osnabrueck.de">
            info@chaostreff-osnabrueck.de
          </a>
        </dd>
        <dt>Internet site</dt>
        <dd>
          <a href="https://chaostreff-osnabrueck.de/">
            https://chaostreff-osnabrueck.de/
          </a>
        </dd>
        <dt>Address</dt>
        <dd>
          Tim Klausmeyer
          <br />
          Chaostreff Osnabrück e.V.
          <br />
          c/o AStA der Universität Osnabrück
          <br />
          Alte Münze 12
          <br />
          49074 Osnabrück
        </dd>
      </dl>

      <p>
        Further ways to contact us are listed on the start page of our website.
      </p>

      <p>
        The Chaostreff Osnabrück e.V. is registered in the register of
        accociations at the Amtsgericht Osnabrück under the number 201413.
      </p>
    </div>
  );
};
