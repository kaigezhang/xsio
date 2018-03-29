// @flow
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import { LabelText, Outline } from 'components/Input';
import { color, fonts, fontWeight } from 'shared/styles/constants';
import { validateColorHex } from 'shared/utils/color';
import { view, store  } from 'react-easy-state';

const colors = [
  '#4E5C6E',
  '#19B7FF',
  '#7F6BFF',
  '#FC7419',
  '#FC2D2D',
  '#FFE100',
  '#14CF9F',
  '#EE84F0',
  '#2F362F',
];

const propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.string,
};

@view
class ColorPicker extends React.Component {
  obs = store({
    selectedColor: color[0],
    customColorValue: '',
    customColorSelected: false
  })

  componentWillMount() {
    const { value } = this.props;
    if (value && colors.includes(value)) {
      this.obs.selectedColor = value;
    } else if (value) {
      this.obs.customColorSelected = true;
      this.obs.customColorValue = value.replace('#', '');
    }
  }

  componentDidMount() {
    this.fireCallback();
  }

  fireCallback = () => {
    this.props.onSelect(
      this.obs.customColorSelected ? this.customColor : this.obs.selectedColor
    );
  };

  get customColor() {
    return this.obs.customColorValue &&
    validateColorHex(`#${this.obs.customColorValue}`)
      ? `#${this.obs.customColorValue}`
      : colors[0];
  }

  setColor = (color) => {
    this.obs.selectedColor = color;
    this.obs.customColorSelected = false;
    this.fireCallback();
  };

  focusOnCustomColor = (event) => {
    this.obs.selectedColor = '';
    this.obs.customColorSelected = true;
    this.fireCallback();
  };

  setCustomColor = (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const color = target.value;
      this.obs.customColorSelected = color.replace('#', '');
      this.fireCallback();
    }
  };

  render() {
    const { selectedColor, customColorSelected, customColorValue } = this.obs;
    return (
      <Flex column>
        <LabelText>Color</LabelText>
        <StyledOutline justify="space-between">
          <Flex>
            {colors.map(color => (
              <Swatch
                key={color}
                color={color}
                active={
                  color === selectedColor && !customColorSelected
                }
                onClick={() => this.setColor(color)}
              />
            ))}
          </Flex>
          <Flex justify="flex-end">
            <strong>自定义颜色:</strong>
            <HexHash>#</HexHash>
            <CustomColorInput
              placeholder="FFFFFF"
              onFocus={this.focusOnCustomColor}
              onChange={this.setCustomColor}
              value={customColorValue}
              maxLength={6}
            />
            <Swatch
              color={this.customColor}
              active={customColorSelected}
            />
          </Flex>
        </StyledOutline>
      </Flex>
    );
  }
}

const SwatchProps = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  active: PropTypes.bool,
};

const Swatch = ({ onClick, ...props }) => (
  <SwatchOutset onClick={onClick} {...props}>
    <SwatchInset {...props} />
  </SwatchOutset>
);

const SwatchOutset = styled(Flex)`
  width: 24px;
  height: 24px;
  margin-right: 5px;
  border: 2px solid ${({ active, color }) => (active ? color : 'transparent')};
  border-radius: 2px;
  background: ${({ color }) => color};
  ${({ onClick }) => onClick && 'cursor: pointer;'} &:last-child {
    margin-right: 0;
  }
`;

const SwatchInset = styled(Flex)`
  width: 20px;
  height: 20px;
  border: 1px solid ${({ active, color }) => (active ? 'white' : 'transparent')};
  border-radius: 2px;
  background: ${({ color }) => color};
`;

const StyledOutline = styled(Outline)`
  padding: 5px;
  flex-wrap: wrap;

  strong {
    font-weight: 500;
  }
`;

const HexHash = styled.div`
  margin-left: 12px;
  padding-bottom: 0;
  font-weight: ${fontWeight.medium};
  user-select: none;
`;

const CustomColorInput = styled.input`
  border: 0;
  flex: 1;
  width: 65px;
  margin-right: 12px;
  padding-bottom: 0;
  outline: none;
  background: none;
  font-family: ${fonts.monospace};
  font-weight: ${fontWeight.medium};

  &::placeholder {
    color: ${color.slate};
    font-family: ${fonts.monospace};
    font-weight: ${fontWeight.medium};
  }
`;

export default ColorPicker;
