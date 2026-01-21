import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

test('Home page', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: 'Application PWA avec Next.js' })).toBeDefined()
})