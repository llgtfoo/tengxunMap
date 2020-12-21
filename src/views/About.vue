<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
  import { LngLat2LatLng } from "../../transform/lnglat2latlng";

  const lngLat2LatLng = new LngLat2LatLng()

  const point = {
    type: 'Point',
    coordinates: [
      116.39123296750768,
      39.907180309385694
    ]
  }

  const MultiPoint = {
    "type": "MultiPoint",
    "coordinates": [
      [
        100.99731445312499,
        36.00911716117325
      ],
      [
        100.90393066406249,
        35.53222622770337
      ]
    ]
  }

  const lineString = {
    "type": "LineString",
    "coordinates": [
      [
        99.5965576171875,
        36.053540128339755
      ],
      [
        98.9923095703125,
        34.69194468425019
      ],
      [
        100.8819580078125,
        34.56085936708384
      ],
      [
        100.8819580078125,
        35.40696093270201
      ]
    ]
  }

  const multiPolygon = {
    "type": "MultiPolygon",
    "coordinates": [
      [
        [
          100.95062255859374,
          35.17156320800291
        ],
        [
          100.70343017578125,
          34.908457853981375
        ],
        [
          100.99456787109375,
          34.70775131553933
        ],
        [
          101.14013671875,
          34.84536693184101
        ],
        [
          100.95062255859374,
          35.17156320800291
        ]
      ],
      [
        [
          101.17584228515625,
          35.1154153142536
        ],
        [
          101.12091064453125,
          35.02999636902566
        ],
        [
          101.25823974609375,
          34.960246302573466
        ],
        [
          101.28570556640624,
          35.077212628195525
        ],
        [
          101.17584228515625,
          35.1154153142536
        ]
      ]
    ]
  }

  const featureCollection = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            109.2919921875,
            30.62373195163005
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            109.423828125,
            30.536242254734933
          ]
        }
      }
    ]
  }

  export default {
    created () {
      console.log(lngLat2LatLng.Point(point))
      console.log(lngLat2LatLng.MultiPoint(MultiPoint))
      console.log(lngLat2LatLng.LineString(lineString))
      console.log(lngLat2LatLng.MultiPolygon(multiPolygon))
      console.log(lngLat2LatLng.FeatureCollection(featureCollection))
    }
  }
</script>

<style>

</style>
