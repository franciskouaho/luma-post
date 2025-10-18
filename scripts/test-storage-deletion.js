const { Storage } = require('@google-cloud/storage');

// Configuration Firebase
const storage = new Storage({
  projectId: 'lumapost-38e61'
});

const bucket = storage.bucket('lumapost-38e61.firebasestorage.app');

async function testStorageDeletion() {
  try {
    console.log('🔍 Test de suppression des fichiers Storage...\n');

    // Lister tous les fichiers dans le bucket
    console.log('📁 Fichiers dans le bucket:');
    const [files] = await bucket.getFiles();
    
    if (files.length === 0) {
      console.log('❌ Aucun fichier trouvé dans le bucket');
      return;
    }

    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}`);
    });

    console.log(`\n📊 Total: ${files.length} fichiers`);

    // Tester la suppression d'un fichier spécifique
    const testFile = files[0];
    console.log(`\n🧪 Test de suppression du fichier: ${testFile.name}`);
    
    try {
      await file.delete();
      console.log('✅ Fichier supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testStorageDeletion();
