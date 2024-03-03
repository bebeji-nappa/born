import BorderedButton from './index';

import type { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'BorderdButton',
  component: BorderedButton,
  args: {
    children: 'Button',
  },
} as Meta<typeof BorderedButton>;

export const Primary: StoryObj<typeof BorderedButton> = {};
