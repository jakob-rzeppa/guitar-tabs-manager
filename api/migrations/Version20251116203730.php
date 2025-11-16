<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251116203730 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TEMPORARY TABLE __temp__tab AS SELECT id, artist_id, title, capo, content, source_url FROM tab
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tab
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tab (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, artist_id INTEGER DEFAULT NULL, title VARCHAR(255) NOT NULL, capo SMALLINT NOT NULL, content CLOB NOT NULL, source_url VARCHAR(255) NOT NULL, CONSTRAINT FK_73E3430CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)
        SQL);
        $this->addSql(<<<'SQL'
            INSERT INTO tab (id, artist_id, title, capo, content, source_url) SELECT id, artist_id, title, capo, content, source_url FROM __temp__tab
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE __temp__tab
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_73E3430CB7970CF8 ON tab (artist_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TEMPORARY TABLE __temp__tab AS SELECT id, artist_id, title, capo, source_url, content FROM tab
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tab
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tab (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, artist_id INTEGER DEFAULT NULL, title VARCHAR(255) NOT NULL, capo SMALLINT NOT NULL, source_url VARCHAR(255) DEFAULT NULL, content CLOB NOT NULL, CONSTRAINT FK_73E3430CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) NOT DEFERRABLE INITIALLY IMMEDIATE)
        SQL);
        $this->addSql(<<<'SQL'
            INSERT INTO tab (id, artist_id, title, capo, source_url, content) SELECT id, artist_id, title, capo, source_url, content FROM __temp__tab
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE __temp__tab
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_73E3430CB7970CF8 ON tab (artist_id)
        SQL);
    }
}
