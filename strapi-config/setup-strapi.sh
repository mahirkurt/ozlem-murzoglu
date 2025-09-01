#!/bin/bash

# Strapi projesini oluştur
echo "Creating Strapi project..."
npx create-strapi-app@latest cms-ozlem-murzoglu \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=strapi \
  --dbusername=strapi \
  --dbpassword=strapi_password \
  --dbssl=false \
  --no-run

cd cms-ozlem-murzoglu

# Content Type oluşturma script'i
cat > create-content-types.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Resource Content Type
const resourceContentType = {
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
};

// Content Type'ı dosyaya kaydet
const contentTypePath = path.join(__dirname, 'src/api/resource/content-types/resource');
if (!fs.existsSync(contentTypePath)) {
  fs.mkdirSync(contentTypePath, { recursive: true });
}

fs.writeFileSync(
  path.join(contentTypePath, 'schema.json'),
  JSON.stringify(resourceContentType, null, 2)
);

console.log('Content types created successfully!');
EOF

# İlk admin kullanıcı oluştur
cat > .env << EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2,toBeModified3,toBeModified4
API_TOKEN_SALT=toBeModified
ADMIN_JWT_SECRET=toBeModified
TRANSFER_TOKEN_SALT=toBeModified
JWT_SECRET=toBeModified
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_password
DATABASE_SSL=false
EOF

echo "Strapi setup completed!"
echo "To start Strapi, run: cd cms-ozlem-murzoglu && npm run develop"