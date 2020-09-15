package dipl.spi.spi_backend.controller;

import dipl.spi.spi_backend.dto.ArticleDto;
import dipl.spi.spi_backend.dto.ArticlePageDto;
import dipl.spi.spi_backend.service.AccountService;
import dipl.spi.spi_backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<ArticlePageDto> searchArticles(@RequestParam(defaultValue = "") String name,
                                                         @RequestParam(defaultValue = "0") int pageNum) {
        return ResponseEntity.ok(articleService.searchArticles(name, pageNum));
    }


    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleDto> getArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(new ArticleDto(articleService.findById(articleId)));
    }


    @PostMapping
    public ResponseEntity<ArticleDto> createArticle(@RequestBody ArticleDto articleDto) {
        return new ResponseEntity<>(
                articleService.createArticle(articleDto),
                HttpStatus.CREATED
        );
    }


    @PutMapping
    public ResponseEntity<ArticleDto> updateArticle(@RequestBody ArticleDto articleDto) {
        return ResponseEntity.ok(articleService.updateArticle(articleDto));
    }


    @DeleteMapping("/{articleId}")
    public ResponseEntity<Long> deleteArticle(@PathVariable Long articleId) {

        return ResponseEntity.ok(articleService.deleteArticle(articleId));
    }


}
