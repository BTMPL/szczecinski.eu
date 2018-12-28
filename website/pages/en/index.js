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

    const Intro = () => {
      return (
        <Container>
          <GridBlock
            align="center"
            layout="threeColumn"
            contents={[
              {
                content: `Kompletne wprowadzenie do tworzenia aplikacji przy użyciu React. Od pierwsych kroków
                  po deploy na serwerze.`,
                image: `${siteConfig.baseUrl}img/react.svg`,
                imageAlign: 'top',
                imageAlt: 'React',
                title: '[Kurs React](/docs/react/podstawowe-pojecia/basic)',
              },
              {
                content: `Najpopularniejszy w świecie React manager stanu - dowiedz się jak z niego korzystać,
                  rozszerzać i testować.`,
                image: `${siteConfig.baseUrl}img/redux.svg`,
                imageAlign: 'top',
                imageAlt: 'Redux',
                title: '[Kurs Redux](/docs/redux/intro/czym-jest-redux)',
              },
              {
                content: `Szybki kurs ES6 zapozna Cię z technikami i narzędziami dodanymi do JavaScript w ES6/ES2015
                  które napotkasz przy pracy z nowymi bibliotekami.`,
                image: `${siteConfig.baseUrl}img/es6.svg`,
                imageAlign: 'top',
                imageAlt: 'Redux',
                title: '[Szybki kurs ES6](/docs/es6/const)',
              }
            ]} 
          /> 
        </Container>
      );
    }

    const Why = props => (
      <Container padding={['bottom']}>

        <h2>O mnie</h2>
        <p>
          Swoją przygodę z React rozpocząłem w 2015 roku - od tego czasu ukończyłem już kilka komercyjnych produktów,
          z których korzystają setki tysięcy użytkowników.
        </p>      
        <p>
          Duża część mojej pracy polega na wprowadzaniu nowych developerów do istniejących już zespołów, dbanie o 
          przekazywanie i utrwalanie wiedzy oraz egzekwowanie dobrych praktyk. Jako moderator społeczności Reactiflux, 
          meet.js Łódź oraz NodeSchool Łódź codziennie mam styczność z osobami o różnym stopniu wiedzy (zarówno 
          z zakresu React jak i samego JavaScript) więc doskonale wiem, jakie błędy popełniane są najczęściej i na co 
          należy zwrócić uwagę.
        </p>      
        <p>
          Kursy przygotowane są z myślą o osobach, które nie czują się jeszcze całkowicie pewnie w standardzie 
          ES6 - wszelkie nowe pojęcia są dokładnie opisane i wytłumaczone zanim zaczniesz znajdywać je w kolejnych 
          przykładach. Kurs jest także aktualizowany na bieżąco dzięki czemu masz pewność, że kod, który poznasz 
          będzie bez problemu działał z aktualną wersją React i innych bibliotek.
        </p>
      </Container>
    )

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer" style={{maxWidth: 940, margin: '0 auto'}}>
          <Intro />

          <Why />
        </div>
      </div>
    );
  }
}

module.exports = Index;
