export const SAMPLE_JSON = {
  basic: {
    name: 'Basic',
    data: {
      name: "JSON Viewer",
      version: "1.0.0",
      description: "A fast, modern JSON viewer, formatter, validator and tree explorer.",
      active: true,
      stars: 1234,
      rating: 4.8,
      tags: ["json", "viewer", "formatter", "validator", "tree"],
      author: null
    }
  },
  nested: {
    name: 'Nested objects',
    data: {
      user: {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        address: {
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
          country: "USA",
          geo: { lat: 37.7749, lng: -122.4194 }
        },
        hobbies: ["reading", "hiking", "photography"],
        active: true,
        joined: "2022-03-15"
      },
      posts: [
        { id: 1, title: "First Post", likes: 42, published: true, tags: ["intro"] },
        { id: 2, title: "Second Post", likes: 17, published: true, tags: ["life", "travel"] },
        { id: 3, title: "Draft", likes: 0, published: false, tags: [] }
      ]
    }
  },
  apiResponse: {
    name: 'API response',
    data: {
      status: 200,
      ok: true,
      headers: {
        "content-type": "application/json",
        "x-request-id": "abc-123-def-456",
        "x-ratelimit-remaining": 98,
        "x-ratelimit-limit": 100
      },
      data: [
        { id: 1, name: "Manchester City", country: "England", founded: 1880, colors: ["sky blue", "white"] },
        { id: 2, name: "Real Madrid", country: "Spain", founded: 1902, colors: ["white"] },
        { id: 3, name: "Bayern Munich", country: "Germany", founded: 1900, colors: ["red", "white"] }
      ],
      meta: {
        page: 1,
        perPage: 20,
        total: 3,
        totalPages: 1,
        cached: true,
        generatedAt: "2026-01-22T15:30:00Z"
      }
    }
  },
  cricbuzzMatch: {
    name: 'Cricket match (live)',
    data: {
      match_id: 13281,
      series: "New Zealand tour of England, 2026",
      match_type: "Test",
      matchs: "1st Test",
      venue: "Lord's, London",
      match_status: "Live",
      current_inning: 2,
      team_a: "England",
      team_a_scores: "140-10",
      team_a_over: "39.4",
      team_b: "New Zealand",
      team_b_scores: "89-8",
      team_b_over: "24.3",
      trail_lead: "New Zealand TRAIL BY 51 RUNS",
      toss: "New Zealand have won the toss and have opted to bowl",
      live: true
    }
  },
  geo: {
    name: 'GeoJSON',
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "San Francisco", population: 873965 },
          geometry: { type: "Point", coordinates: [-122.4194, 37.7749] }
        },
        {
          type: "Feature",
          properties: { name: "New York", population: 8419600 },
          geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
        }
      ]
    }
  },
  big: {
    name: 'Large (500 items)',
    data: Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      uuid: cryptoRandom(),
      name: `Item ${i + 1}`,
      active: i % 2 === 0,
      score: Math.floor(Math.random() * 1000),
      tags: pickN(['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink'], 2)
    }))
  }
}

function cryptoRandom() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function pickN(arr, n) {
  const copy = [...arr]
  const out = []
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

export const SAMPLE_LIST = Object.entries(SAMPLE_JSON).map(([key, v]) => ({ key, name: v.name }))
