package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;


    public Article findById(Long articleId) {
        Optional<Article> optArticle = articleRepository.findById(articleId);
        if(optArticle.isEmpty()) {
            throw new ApiNotFoundException("Failed to find article with id " + articleId);
        }
        return optArticle.get();
    }
}
