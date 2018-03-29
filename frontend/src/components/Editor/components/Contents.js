// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import { color } from 'shared/styles/constants';
import headingToSlug from '../headingToSlug';

const propTypes = {
  editor: PropTypes.object,
};


const headingElements = () => {
  const elements = [];
  const tagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  /* eslint-disable */
  for (const tagName of tagNames) {
    for (const ele of document.getElementsByTagName(tagName)) {
      elements.push(ele);
    }
  }
  /* eslint-enable */

  return elements;
};

class Contents extends Component {
  state = {
    activeHeading: ''
  }
  componentDidMount() {
    window.addEventListener('scroll', this.updateActiveHeading);
    this.updateActiveHeading();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateActiveHeading);
  }


  get headings() {
    const { editor } = this.props;

    return editor.value.document.nodes.filter((node) => {
      if (!node.text) return false;
      return node.type.match(/^heading/);
    });
  }
  updateActiveHeading = () => {
    const elements = headingElements();
    if (!elements.length) return;

    let activeHeading = elements[0].id;
    /* eslint-disable */
    for (const element of elements) {
      const bounds = element.getBoundingClientRect();
      if (bounds.top <= 0) activeHeading = element.id;
    }
    /* eslint-enable */

    this.setState({
      activeHeading
    });
  };
  render() {
    const { editor } = this.props;
    const { activeHeading } = this.state;

    // If there are one or less headings in the document no need for a minimap
    if (this.headings.size <= 1) return null;

    return (
      <Wrapper>
        <Sections>
          {this.headings.map((heading) => {
            const slug = headingToSlug(editor.value.document, heading);
            const active = activeHeading === slug;

            return (
              <ListItem type={heading.type} active={active} key={slug}>
                <Anchor href={`#${slug}`} active={active}>
                  {heading.text}
                </Anchor>
              </ListItem>
            );
          })}
        </Sections>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: none;
  position: fixed;
  right: 0;
  top: 150px;
  z-index: 100;

  @media print {
    display: none;
  }

  ${breakpoint('tablet')`
    display: block;
  `};
`;

const Anchor = styled.a`
  color: ${props => (props.active ? color.slateDark : color.slate)};
  font-weight: ${props => (props.active ? 500 : 400)};
  opacity: 0;
  transition: all 100ms ease-in-out;
  margin-right: -5px;
  padding: 2px 0;
  pointer-events: none;
  text-overflow: ellipsis;

  &:hover {
    color: ${color.primary};
  }
`;

const ListItem = styled.li`
  position: relative;
  margin-left: ${props => (props.type.match(/heading[12]/) ? '8px' : '16px')};
  text-align: right;
  color: ${color.slate};
  padding-right: 16px;
  white-space: nowrap;

  &:after {
    color: ${props => (props.active ? color.slateDark : color.slate)};
    content: "${props => (props.type.match(/heading[12]/) ? '—' : '–')}";
    position: absolute;
    right: 0;
  }
`;

const Sections = styled.ol`
  margin: 0 0 0 -8px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  width: 100px;
  transition-delay: 1s;
  transition: width 100ms ease-in-out;

  &:hover {
    width: 300px;
    transition-delay: 0s;

    ${Anchor} {
      opacity: 1;
      margin-right: 0;
      background: ${color.white};
      pointer-events: all;
    }
  }
`;

export default Contents;
