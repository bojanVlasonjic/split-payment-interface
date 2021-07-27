package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.ArticleDto;
import dipl.spi.spi_backend.dto.ArticlePageDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.mappers.ArticleMapper;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private AppUserService userService;

    @Autowired
    private PaymentSplitService paymentSplitService;

    @Autowired
    private ArticleMapper articleMapper;

    private static final int elementsPerPage = 4;


    public ArticlePageDto searchArticles(String name, int pageNum) {

        if(pageNum < 0) {
            throw new ApiBadRequestException("Invalid page number");
        }

        Pageable pageable = PageRequest.of(pageNum, elementsPerPage, Sort.by("name").ascending());
        Page<Article> articlePage = articleRepository.findByUserIdAndNameContaining(-1L, name ,pageable);

        return articleMapper.articlePageToArticlePageDto(articlePage);

    }


    public Article findById(Long articleId) {
        Optional<Article> optArticle = articleRepository.findById(articleId);
        if(optArticle.isEmpty()) {
            throw new ApiNotFoundException("Failed to find article with id " + articleId);
        }
        return optArticle.get();
    }


    public ArticleDto createArticle(ArticleDto articleDto) {

        AppUser user = userService.findUserById(articleDto.getUserId());
        Article article = articleMapper.articleDtoToArticle(articleDto, user);

        try {
            articleRepository.save(article);
            return articleMapper.articleToArticleDto(article);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ApiBadRequestException("Failed to save article. Please refresh the page and try again");
        }

    }

    public ArticleDto updateArticle(ArticleDto articleDto) {

        if(articleDto.getId() != null) {
            Article article = this.findById(articleDto.getId());

            if(articleDto.getPrice() < article.getPrice() &&
                    paymentSplitService.getPaymentSplitsForArticle(article.getId()).size() > 0) {
                throw new ApiBadRequestException("Can't decrease price for article with payment splits");
            }

            article.updateValues(articleDto);
            articleRepository.save(article);
        } else {
            throw new ApiBadRequestException("Invalid article id");
        }

        return articleDto;
    }

    public boolean deleteArticle(Long articleId) {

        Article article = this.findById(articleId);

        try {
            articleRepository.delete(article);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ApiBadRequestException("Failed to delete article. Please refresh the page and try again");
        }

        return true;
    }
}
