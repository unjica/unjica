import { PrismaClient } from '@prisma/client';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function restoreData() {
  try {
    // Open SQLite database
    const db = await open({
      filename: join(__dirname, '../prisma/dev.db'),
      driver: sqlite3.Database
    });

    console.log('Starting data restoration...');

    // Restore admin user
    console.log('Restoring admin user...');
    const adminUser = await db.get('SELECT * FROM users WHERE email = ?', ['sanja.malovic2@gmail.com']);
    if (adminUser) {
      await prisma.user.upsert({
        where: { email: adminUser.email },
        update: {
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password,
          role: adminUser.role,
          image: adminUser.image,
        },
        create: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password,
          role: adminUser.role,
          image: adminUser.image,
        }
      });
      console.log('Admin user restored successfully');
    }

    // Restore articles
    console.log('Restoring articles...');
    const articles = await db.all('SELECT * FROM generated_articles');
    
    for (const article of articles) {
      await prisma.generatedArticle.upsert({
        where: { id: article.id },
        update: {
          title: article.title,
          content: article.content,
          primaryTopic: article.primaryTopic,
          summary: article.summary,
          tags: article.tags,
          publishedAt: new Date(parseInt(article.publishedAt)),
          sourceNewsIds: article.sourceNewsIds,
          lastUpdated: new Date(parseInt(article.lastUpdated)),
          imageUrl: article.imageUrl,
          slug: article.slug,
        },
        create: {
          id: article.id,
          title: article.title,
          content: article.content,
          primaryTopic: article.primaryTopic,
          summary: article.summary,
          tags: article.tags,
          publishedAt: new Date(parseInt(article.publishedAt)),
          sourceNewsIds: article.sourceNewsIds,
          lastUpdated: new Date(parseInt(article.lastUpdated)),
          imageUrl: article.imageUrl,
          slug: article.slug,
        }
      });
    }
    console.log(`${articles.length} articles restored successfully`);

    // Close connections
    await db.close();
    await prisma.$disconnect();

    console.log('Data restoration completed successfully!');
  } catch (error) {
    console.error('Error during data restoration:', error);
    process.exit(1);
  }
}

restoreData(); 