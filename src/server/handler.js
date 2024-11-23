const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // Lakukan prediksi
  const { label, suggestion } = await predictClassification(model, image);

  // Buat ID dan timestamp
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data); // Simpan data ke Firestore

  // Respons sukses
  return h.response({
    status: 'success',
    message: "Model is predicted successfully",
    data,
  }).code(201);
}

// async function predictHistories(request, h) {
//   const { Firestore } = require("@google-cloud/firestore");
//   const db = new Firestore({
//     projectId: "submissionmlgc-malvin",

//   });

//   try {
//     const predictCollection = db.collection("predictions");
//     const snapshot = await predictCollection.get();

//     if (snapshot.empty) {
//       return h.response({
//         status: "success",
//         data: [],
//       });
//     }

//     const result = [];
//     snapshot.forEach((doc) => {
//       result.push({
//         id: doc.id,
//         history: {
//           result: doc.data().result,
//           createdAt: doc.data().createdAt,
//           suggestion: doc.data().suggestion,
//         },
//       });
//     });

//     return h.response({
//       status: "success",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching prediction histories:", error);
//     return h.response({
//       status: "fail",
//       message: "Failed to fetch prediction histories",
//     }).code(500);
//   }
// }

module.exports = { postPredictHandler };
