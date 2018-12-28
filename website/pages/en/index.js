/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title.toLowerCase()}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('es6/01-const')}>Kurs ES6</Button>
            <Button href={docUrl('react/lekcja1/01-basic')}>Kurs React</Button>
            <Button href={docUrl('redux/intro/czym-jest-redux')}>Kurs Redux</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Why = props => (
      <Container padding={['bottom']}>
        <h2>Dlaczego warto zainwestować w naukę React?</h2>
        <p>Zarówno ilość developerów, jak i ofert pracy dla developerów React rośnie praktycznie nieprzerwanie od 2013 roku 1. Pojawiają się kolejne dziedziny w, w których React ma zastosowanie - React Native (Android, iOS, Windows Mobile), React Native for Windows, ReactVR czy Xbox (przy użyciu Universal Windows Platform).</p>      
        <p>Stosunkowo niski "próg wejścia", całkowita kompatybilność wsteczna oraz duża i aktywna społeczność developerów, kontrybutorów i autorów niezależnych bibliotek sprawia, że React nie jest technologią, obok której można przejść obojętnie. Brak unikalnego języka domenowego (ang. domain specific language) sprawia, że wiedza nabyta podczas nauki React przyda się również w innych projektach - oznacza to, że inwestując czas w naukę React nie zmniejszamy szansy na zmianę technologii w której pracujemy w przyszłości.</p>      
        <p>React będzie doskonałym wyborem, wszędzie tam, gdzie celem jest wytworzenie rozbudowanego interfejsu użytkownika, reagującego w czasie rzeczywistym na interakcję zarówno użytkownika jak i serwera.</p>
        
        <h2>Dlaczego właśnie ten kurs?</h2>
        <p>Swoją przygodę z React rozpocząłem w 2015 roku - od tego czasu ukończyłem już kilka komercyjnych produktów, z których korzystają setki tysięcy użytkowników.</p>      
        <p>Duża część mojej pracy polega na wprowadzaniu nowych developerów do istniejących już zespołów, dbanie o przekazywanie i utrwalanie wiedzy oraz egzekwowanie dobrych praktyk. Jako moderator społeczności Reactiflux, meet.js łódź oraz NodeSchool Łódź codziennie mam styczność z osobami o różnym stopniu wiedzy (zarówno z zakresu React jak i samego JavaScript) więc doskonale wiem, jakie błędy popełniane są najczęściej i na co należy zwrócić uwagę.</p>      
        <p>Kurs przygotowany jest z myślą o osobach, które nie czują się jeszcze całkowicie pewnie w standardzie ES6 - wszelkie nowe pojęcia są dokładnie opisane i wytłumaczone zanim zaczniesz znajdywać je w kolejnych przykładach. Kurs jest także aktualizowany na bieżąco dzięki czemu masz pewność, że kod, który poznasz będzie bez problemu działał z aktualną wersją React i innych bibliotek.</p>
      </Container>
    )

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer" style={{maxWidth: 940, margin: '0 auto'}}>
          <Why />
        </div>
      </div>
    );
  }
}

module.exports = Index;
