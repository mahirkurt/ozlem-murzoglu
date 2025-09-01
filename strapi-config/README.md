# Strapi CMS Konfigürasyonu

Bu klasör, Dr. Özlem Murzoğlu web sitesi için Strapi CMS yapılandırmasını içerir.

## Kurulum

### Option 1: Docker ile Kurulum (Önerilen)

```bash
docker-compose up -d
```

### Option 2: Manuel Kurulum

1. Node.js 18 veya 20 versiyonunu kurun
2. Strapi'yi kurun:
```bash
npx create-strapi-app@latest cms-ozlem-murzoglu --quickstart
```

## Content Types

### Resource Content Type

```json
{
  "collectionName": "resources",
  "info": {
    "singularName": "resource",
    "pluralName": "resources",
    "displayName": "Resource",
    "description": "Pediatri kaynak içerikleri"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "resourceKey": {
      "type": "string",
      "required": true,
      "unique": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "categoryKey": {
      "type": "enumeration",
      "enum": [
        "vaccines",
        "general",
        "diseases",
        "pregnancy",
        "development",
        "toys",
        "media",
        "bright-futures-family",
        "bright-futures-child"
      ],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "description": {
      "type": "text",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "content": {
      "type": "richtext",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "contentType": {
      "type": "enumeration",
      "enum": ["html", "markdown"],
      "default": "markdown",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "metadata": {
      "type": "json",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "featuredImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "attachments": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": ["files", "images"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "tags": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::tag.tag",
      "inversedBy": "resources"
    },
    "viewCount": {
      "type": "integer",
      "default": 0,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "order": {
      "type": "integer",
      "default": 0,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    }
  }
}
```

### SEO Component

```json
{
  "collectionName": "components_shared_seos",
  "info": {
    "displayName": "seo",
    "description": "SEO metadata"
  },
  "options": {},
  "attributes": {
    "metaTitle": {
      "type": "string",
      "maxLength": 60
    },
    "metaDescription": {
      "type": "text",
      "maxLength": 160
    },
    "metaKeywords": {
      "type": "text"
    },
    "ogTitle": {
      "type": "string"
    },
    "ogDescription": {
      "type": "text"
    },
    "ogImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "twitterCard": {
      "type": "enumeration",
      "enum": ["summary", "summary_large_image", "app", "player"]
    },
    "canonicalURL": {
      "type": "string"
    },
    "structuredData": {
      "type": "json"
    }
  }
}
```

### Tag Content Type

```json
{
  "collectionName": "tags",
  "info": {
    "singularName": "tag",
    "pluralName": "tags",
    "displayName": "Tag"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "resources": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::resource.resource",
      "mappedBy": "tags"
    }
  }
}
```

## API Tokens

Admin panelden API token oluşturun:
1. Settings > API Tokens
2. Create new API Token
3. Name: `Firebase Functions`
4. Token duration: Unlimited
5. Token type: Full access (veya Custom with read permissions)

## Webhook Configuration

Admin panelden webhook ekleyin:
1. Settings > Webhooks
2. Create new webhook
3. Name: `Firebase Functions Cache Clear`
4. URL: `https://europe-west1-dr-murzoglu.cloudfunctions.net/strapiWebhook`
5. Events:
   - Entry.create
   - Entry.update
   - Entry.delete
   - Media.create
   - Media.update
   - Media.delete

## Environment Variables

`.env` dosyası:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Production için PostgreSQL
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=strapi
# DATABASE_PASSWORD=strapi
# DATABASE_SSL=false

# Cloudinary (optional)
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Plugins

Önerilen pluginler:

1. **@strapi/plugin-i18n**: Çoklu dil desteği (built-in)
2. **@strapi/plugin-users-permissions**: Kullanıcı yönetimi (built-in)
3. **strapi-plugin-slugify**: Otomatik slug oluşturma
4. **strapi-plugin-import-export-content**: İçerik import/export
5. **strapi-plugin-transformer**: Response transformation
6. **strapi-plugin-seo**: SEO analizi

## Deployment

### Railway.app Deployment

```bash
railway login
railway init
railway add
railway up
```

### Render.com Deployment

1. GitHub'a push edin
2. Render.com'da yeni Web Service oluşturun
3. Environment variables ekleyin
4. Deploy

### DigitalOcean App Platform

1. GitHub integration
2. App oluştur
3. Environment variables
4. Deploy

## Backup Strategy

1. **Database Backup**: Günlük otomatik backup
2. **Media Backup**: Cloudinary veya S3
3. **Config Backup**: Git repository

## Monitoring

1. **Uptime Monitoring**: UptimeRobot
2. **Error Tracking**: Sentry
3. **Analytics**: Google Analytics API integration