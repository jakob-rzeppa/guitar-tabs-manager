<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250623094056 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE artist (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tab (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, artist_id INTEGER DEFAULT NULL, title VARCHAR(255) NOT NULL, capo SMALLINT NOT NULL, content CLOB NOT NULL, CONSTRAINT FK_73E3430CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) NOT DEFERRABLE INITIALLY IMMEDIATE)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_73E3430CB7970CF8 ON tab (artist_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tab_tag (tab_id INTEGER NOT NULL, tag_id INTEGER NOT NULL, PRIMARY KEY(tab_id, tag_id), CONSTRAINT FK_CAB7A2F18D0C9323 FOREIGN KEY (tab_id) REFERENCES tab (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_CAB7A2F1BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_CAB7A2F18D0C9323 ON tab_tag (tab_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_CAB7A2F1BAD26311 ON tab_tag (tag_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tag (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP TABLE artist
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tab
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tab_tag
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tag
        SQL);
    }
}
