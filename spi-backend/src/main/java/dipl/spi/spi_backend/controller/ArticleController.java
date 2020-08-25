package dipl.spi.spi_backend.controller;

import dipl.spi.spi_backend.dto.ArticleDto;
import dipl.spi.spi_backend.service.AccountService;
import dipl.spi.spi_backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleDto> getArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(new ArticleDto(articleService.findById(articleId)));
    }
}
