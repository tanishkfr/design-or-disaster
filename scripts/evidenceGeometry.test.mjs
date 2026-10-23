import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  rectangleFromPoints,
  normalizeGeometry,
} from '../src/utils/evidenceGeometry.js'

test('reverse drags preserve screenshot-relative bounds', () => {
  assert.deepEqual(rectangleFromPoints({ x: 80, y: 70 }, { x: 20, y: 10 }), {
    x: 20,
    y: 10,
    width: 60,
    height: 60,
  })
})
test('old point annotations retain their center and fields', () => {
  const point = {
    id: 'old',
    x: 50,
    y: 40,
    lens: 'trust',
    note: 'Saved observation',
  }
  assert.deepEqual(normalizeGeometry(point, {}), point)
})
test('editing a rectangle cannot move it outside the image', () => {
  const result = normalizeGeometry(
    { x: 20, y: 30, width: 40, height: 30 },
    { x: 95, y: -2 },
  )
  assert.ok(result.x + result.width <= 100)
  assert.ok(result.y >= 0)
  assert.ok(result.y + result.height <= 100)
})
