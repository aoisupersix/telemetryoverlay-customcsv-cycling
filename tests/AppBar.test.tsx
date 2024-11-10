import * as React from 'react'

import { render, screen } from '@testing-library/react'

import { AppBar } from '../src/components/app-bar'

describe('AppBar', () => {
  test('should render', () => {
    render(<AppBar />)
    expect(
      screen.getByText('TelemetryOverlay custom CSV generation for cycling'),
    ).toBeTruthy()
  })
})
