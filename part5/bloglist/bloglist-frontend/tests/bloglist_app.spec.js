import { test, expect } from '@playwright/test'
const { describe, beforeEach } = test
import { createBlog, loginWith } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'test user',
        username: 'tester',
        password: 'wordpass'
      }
    })

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.waitForURL('/')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test blog', 'playwright', 'https//playwright.test.com')

      await expect(page.getByText('test blog by playwright')).toBeVisible()
    })

    describe('with blog added', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test blog', 'playwright', 'https://playwright.test.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByText('test blog by playwright').click() 
        await expect(page.getByText(/likes 0/)).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText(/likes 1/)).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.getByText('test blog by playwright').click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await page.waitForURL('/')
        await expect(page.getByText('test blog by playwright')).not.toBeVisible()
      })
    })
  })
})