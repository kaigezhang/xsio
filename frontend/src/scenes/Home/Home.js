import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Grid from 'styled-components-grid';

import { developers, githubUrl, signin } from 'shared/utils/routeHelpers';
import { color } from 'shared/styles/constants';
import Hero from './components/Hero';
import { TopNavigation } from './components/Navigation';

const Home = ({
  auth
}) => (
  <React.Fragment>
    <TopNavigation auth={auth} />
    <span>
      <Helmet>
        <title>Xueshu - Reading, Sharing and Writing</title>
      </Helmet>

      <Grid>
        <Hero>
          <h1>你的私人知识库</h1>
          <HeroText>
            笔记,阅读器, wiki, 草稿, 综述, 实验记录 。。。
          </HeroText>
          <p>
            <Button href={signin()}>
              登录或注册
            </Button>
          </p>
        </Hero>

        <Highlights id="features">
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>开源</h2>
            <p>
            一切对任何人开放
            </p>
          </Feature>
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>知识流动</h2>
            <p>
            让学术不止停留在纸张上
            </p>
          </Feature>
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>协作</h2>
            <p>
            你不是一个人在奋斗
            </p>
          </Feature>
        </Highlights>
      </Grid>
    </span>
  </React.Fragment>
);

const Highlights = styled(Grid)`
  width: 100%;
  background: ${color.yellow};
  margin: 0 1em;
  padding: 0 1em;
`;

const Feature = styled(Grid.Unit)`
  padding: 4em 3em;

  h2 {
    margin-top: 0;
  }

  a {
    color: ${color.black};
    text-decoration: underline;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
  }
`;

const HeroText = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  color: ${color.white};
  background: ${color.black};
  border-radius: 4px;
  font-weight: 600;
`;

export default Home;
